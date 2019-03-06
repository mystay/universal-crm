module UniversalCrm
  class Attachment
    require 'carrierwave/mongoid'
    require 'open-uri'

    include Mongoid::Document
    include Mongoid::Timestamps
    include HmsCore::Concerns::Taggable
    include HmsCore::Concerns::Commentable
    include HmsCore::Concerns::Kind
    include HmsCore::Concerns::Polymorphic
    include HmsCore::Concerns::Trashable

    field :n, as: :name
    field :no, as: :notes
    field :surl, as: :shortened_url
    field :tci, as: :temporary_comment_id

    mount_uploader :file, UniversalCrm::FileUploader

    validates_presence_of :file
    scope :for_comment, -> (c){where(tci: c)}
    scope :for_name, ->(n){where(name: n)}
    scope :recent, ->(){order_by(created_at: :desc)}
    before_update :download_uploaded_file
    after_update :move_uploaded_file

    def download_uploaded_file
      if !self.temporary_comment_id.blank?
        new_file_path = Rails.root.join('tmp', "#{self.file_filename}")
        File.open(new_file_path, 'wb') do |f|
          f << open("http:#{self.file.url.gsub(/hms\/(.*)attachment/, "hms/attachment")}").read
        end
      end
    end

    def move_uploaded_file
      if self.subject_id_changed?
        comment = self.subject_type.classify.constantize.find(self.subject_id)
        comment.attachments.create file: File.open(Rails.root.join('tmp', "#{self.file_filename}"))
        self.destroy
      end
    end

    def image?
      %w(.png .jpg .gif).any?{ |file_type| self.file_filename.include?(file_type) }
    end

    def title
      self.name.blank? ? self.file_filename : self.name
    end

    def to_json
      {
        id: self.id.to_s,
        name: self.name,
        file: self.file_filename,
        url: self.file.url,
        created_at: self.created_at,
        shortened_url: self.shortened_url,
        subject_type: self.subject_type,
        subject_id: self.subject_id,
        subject_name: self.subject.name,
        created_formatted: self.created_at.strftime('%b %d, %Y'),
        image: self.image?,
        temp_comment_id: self.tci
      }
    end

  end

end
