const xml2js = require("xml2js");

let current_slide = 1;

const parse_xml = async (xml_string) => {
    const parser = new xml2js.Parser();
    return parser.parseStringPromise(xml_string);
};

const generate_response_xml = async (status, message) => {
    const builder = new xml2js.Builder();
    const response = {
        response: {
            status: status,
            message: message,
            current_slide: current_slide
        }
    };
    return builder.buildObject(response);
};

const process_command = async (xml_string) => {
    try {
        // XML feldolgozása
        const data = await parse_xml(xml_string);
        console.log("received_command:", data);

        let status = "error";
        let message = "invalid_command";

        if (data.command && data.command.action) {
            const action = data.command.action[0];

            if (action === "start") {
                status = "ok";
                message = "presentation_started";
                current_slide = 1; 
            } else if (action === "stop") {
                status = "ok";
                message = "presentation_stopped";
            } else if (action === "next") {
                status = "ok";
                message = "next_slide";
                current_slide++;
            } else if (action === "previous") {
                if (current_slide > 1) {
                    current_slide--;
                    status = "ok";
                    message = "previous_slide";
                } else {
                    status = "error";
                    message = "already_at_first_slide";
                }
            }
        }

        return await generate_response_xml(status, message);
    } catch (error) {
        console.error("error_processing_xml:", error);
        return await generate_response_xml("error", "invalid_xml_format");
    }
};
