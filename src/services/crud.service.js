const gets = (model) => (queryValidated) => {
    return model.find(queryValidated) 
}

module.exports = {
    gets
}