let presentations = {};

const start_presentation = (id) => {
    presentations[id] = { current_slide: 1, started_at: new Date() };
    return { success: true, presentation_id: id, action: "start", started_at: presentations[id].started_at };
};

const next_slide = (id) => {
    if (!presentations[id]) return { success: false, message: "Presentation not found" };

    presentations[id].current_slide++;
    return { success: true, presentation_id: id, action: "next", current_slide: presentations[id].current_slide };
};

const previous_slide = (id) => {
    if (!presentations[id]) return { success: false, message: "Presentation not found" };

    if (presentations[id].current_slide > 1) {
        presentations[id].current_slide--;
    }
    return { success: true, presentation_id: id, action: "previous", current_slide: presentations[id].current_slide };
};

const goto_slide = (id, goto_slide) => {
    if (!presentations[id]) return { success: false, message: "Presentation not found" };

    presentations[id].current_slide = goto_slide;
    return { success: true, presentation_id: id, action: "goto", current_slide: goto_slide };
};

const stop_presentation = (id) => {
    if (!presentations[id]) return { success: false, message: "Presentation not found" };

    const stopped_at = new Date();
    delete presentations[id];
    return { success: true, presentation_id: id, action: "stop", stopped_at };
};

const restart_presentation = (id) => {
    if (!presentations[id]) return { success: false, message: "Presentation not found" };

    presentations[id] = { current_slide: 1, started_at: new Date() };
    return { success: true, presentation_id: id, action: "restart", started_at: presentations[id].started_at };
};