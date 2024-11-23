import fs from 'fs';

const createFile = (instruments, fileName, name) => {
    try {

        const instrumentJson = JSON.stringify(instruments, null, 2);
        fileName = fileName.replace(/[:\s]/g, "-");
        fs.writeFileSync(fileName, instrumentJson, "utf-8");
        const reqId = instruments.find((instrument) => instrument.tradingsymbol == name);

        if(reqId) {

            console.log("Instrument token for" + name, reqId.instrument_token);

        } else {
            console.log("Token not found");
        }
        
    } catch (error) {

        console.log(error);
        console.log("Error in creating file");
        
    }
}

export default createFile;