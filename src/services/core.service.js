
const gets = (model, queryValidated) => {
    console.log(`core service gets`)

    const {skip, limit} = pagination(req.query);
    
    model.find(queryValidated) 
        .sort({createAt: 'descending'})
        .skip(skip)
        .limit(limit)
        .then(docs => docs)
        .catch(error => error)
}