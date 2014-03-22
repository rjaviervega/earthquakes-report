#
# Ruby Class To Implement Import EarthQuake Functions
# This class implements functions used by Rakefile 
# to import EarthQuake data into mongo db.
# This class is a pre-processor of a partially valid
# CVS file that converts its data into JSON format.
#
# The Rakefile was implemented using this Class to be 
# able to Unit Test this class and therefore test the
# rake tasks associated to it.
#

require 'open-uri'

class ImportEarthQuakeData
    
    # Open URL and Return Lines as Array of Lines
    def openURL(filestr)
      lines = []
      file_data = open(filestr)
      file_data.each do |line|
        lines << line
      end      
      return lines
    end
        
    # Append String To Header
    def getUpdatedHeaders (header)
      newHeader = header.strip << ',UnixTimeStamp' << ',location'
      return newHeader 
    end
    
    # Return Array of Words from String Separated by ','
    def parseHeader (line)
      headerArray = []
      header = line.strip << ',UnixTimeStamp' << ',location'
      headerArray = header.split(',')
      return headerArray 
    end    
        
    # Get the Newest DateTime From Records
    def getNewestDateTimeRecord(lines)
      csv_timeStamp = lines[1].parse_csv
      timeStamp     = csv_timeStamp[3]
      d = DateTime.parse(timeStamp);
      return d.to_time.to_i
    end       
    
    # Get Last Imported Record From File
    def getLastImportedRecord(filename)
      last_record_timeStamp = 0
      if (File.exist?(filename))
        last_record_timeStamp = File.read(filename)
      end
      return last_record_timeStamp
    end
    
    # Process CVS Array to JSON Array of Objects
    # retuen json array of objects from CVS file with TimeStamp & GeoLocation in Format for MongoDB
    def processRecords (lines, headerArray, lastRecordTimeStamp)
      csv_lines = []
      csv_lines << lines[0].parse_csv;
      json_hash = []
      lines[1..-1].each do |line|
        csv_timeStamp = line.parse_csv
        timeStamp     = csv_timeStamp[3]
        d = DateTime.parse(timeStamp).to_time.to_i
        if (d>lastRecordTimeStamp.to_i)
          new_line = line.parse_csv << d
          location = []
          location = [new_line[5].to_f, new_line[4].to_f]
          json_hash << { headerArray[0]=>new_line[0],
                         headerArray[1]=>new_line[1],
                         headerArray[2]=>new_line[2],
                         headerArray[3]=>new_line[3],
                         headerArray[4]=>new_line[4],
                         headerArray[5]=>new_line[5],
                         headerArray[6]=>new_line[6],
                         headerArray[7]=>new_line[7],
                         headerArray[8]=>new_line[8],
                         headerArray[9]=>new_line[9],
                         headerArray[10]=>new_line[10],
                         headerArray[11]=>location }
        end
      end  
      return json_hash 
    end
    
end