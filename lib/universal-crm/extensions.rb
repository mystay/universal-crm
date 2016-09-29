class String
  
  def hideQuotedLines
    s = self.gsub("\r",'')
    lines = s.split("\n")
    new_string = ''
    lines.each do |line|
      if line[0,1] == '>'
        new_string += "."
      else
        new_string += line + "\r\n"
      end
    end
    return new_string
  end
  
end