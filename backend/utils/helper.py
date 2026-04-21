def success(message=None, data=None):
    return {
        "status": "success",
        "message": message,
        "data": data
    }

def error(message):
    return {
        "status": "error",
        "message": message
    }