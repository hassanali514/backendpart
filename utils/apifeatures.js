class ApiFeatures{
    constructor(query,queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }

    searchCandidateByPassportNumber(){
        const keyword = this.queryStr.keyword
        ? {
            passportNo: {
                $regex: this.queryStr.keyword,
                $options: "i",
            },
        }:{};
        this.query = this.query.find({...keyword});
        return this;
    }
}