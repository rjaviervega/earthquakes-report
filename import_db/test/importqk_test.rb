#
# Unit Testing Import EarthQuake Tasks
#
require 'test/unit'
require 'csv'
require '../lib/importqk'

class TestImport < Test::Unit::TestCase
		
	def testImportClasses
		task = ImportEarthQuakeData.new
		
		# Assert Open URL File Method
		lines = task.openURL 'http://www.google.com'
		lines_count = lines.length
		assert_operator lines_count, :>=, 1
		
		# Assert Update Headers
		header = task.getUpdatedHeaders('a,b,c,d,e,f,g,h,i,j')
		assert_equal header, 'a,b,c,d,e,f,g,h,i,j,UnixTimeStamp,location'
		
		# Assert Headers to Array
		headers = task.parseHeader(header)
		headers_size = headers.length
		assert_operator headers_size, :>=, 1
		
		# Defining Sample Data
		sample_data = []
		sample_data[0] = 'a,b,c,d,e,f,g,h,i,j'
		sample_data[1] = '0,0,0,Saturday March 22 2014 18:38:56 UTC,-10,100,g,h,i,j'
		
		# Datetime Newest Value
		time = task.getNewestDateTimeRecord(sample_data)
		assert_equal time, 1395513536

		# Last Date on Empty File
		last_date = task.getLastImportedRecord('')
		assert_equal last_date, 0
		
		#
		# Processing JSON OUT File, Unix TimeStamp & Geo Location Array
		#
		json = task.processRecords(sample_data, headers, last_date)
		rec1 = json[0]
		assert_equal rec1["a"].to_i, 0
		assert_equal rec1["UnixTimeStamp"].to_i, 1395513536
		assert_equal rec1["location"][0], 100
		assert_equal rec1["location"][1], -10		
		
	end
	
end	
