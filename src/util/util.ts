
 function convertBytesToMB(bytes:number){
    
  return (bytes / 1024 / 1024).toFixed(2);
    
}

// coonvert time to mb per second
function convertTimeToMBPerSecond(bytes:number, time:number){
  time = time / 1000; // transform to seconds
  
  // bytes / 10^6 =  mb 

return  (bytes / ((1 / Math.pow(10, 3)) * time) / Math.pow(10, 6)/1024).toFixed(2);
   
}

export { convertBytesToMB  as convertBytes, convertTimeToMBPerSecond };
