I have completed my task that by using rest api endpoints like pause,resume,terminate but you cant see so much of a differnce because readstream is so fast that it will read million of records in 2-3 seconds but while writing this data to a text file or sending this much amount of data to atlan collect dashboard than pause endpoint can be beneficial if a user wants to pause a file upload to a dashboard.

Terminate endpoint will terminate the worker process if user wants to terminate a file upload to dashboard.

This approach of using worker threads and implementing the pause,terminate,resume api endpoints will help and gets improved according when atlans data and dashboard is integrated with this small server.

There should be some changes required when integrating this task to atlan server.


API Endpoints are
Start
http://localhost:3000/start                                    change localhost to public ip of your server
and headers will be 
userId:any id 

Pause
http://localhost:3000/pause
and headers will be
userId:any id

Resume
http://localhost:3000/resume
and headers will be
userId:any id

Stop
http://localhost:3000/stop
and headers will be
userId:any id



And there is test.js in root folder because i want to show you what i mean by stopping a readstream(check console for output)
ReadStream should be paused because while reading from a file and writing to another file (writestream is slower) so we have to pause a readStream this can also be used while passing data from file to atlan collect dashboard.



LINK FOR API ENDPOINTS DESCRIPTION(this will open a postman dashboard)
https://www.getpostman.com/collections/1687b28c4a0cf12c666d


