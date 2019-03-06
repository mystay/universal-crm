module UniversalCrm
  class FileUploader < CarrierWave::Uploader::Base

    include CarrierWave::RMagick

    storage :fog

    # Override the directory where uploaded files will be stored.
    # This is a sensible default for uploaders that are meant to be mounted:
    def store_dir
      path = []
      if !model.subject.nil?
        path.push(model.subject.class.name.demodulize.to_s.underscore)
        path.push(model.subject.id.to_s)
      end
      path.push(model.class.name.demodulize.to_s.underscore)
      path.push(model.id)
      return path.join('/')
    end

  end
end
