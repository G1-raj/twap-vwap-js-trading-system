const sanitize = (file) => {
    return file.replace(/[:\s]/g, "-")
}

export default sanitize;