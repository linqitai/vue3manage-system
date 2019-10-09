function getLetterLength(str){
    if(/[a-oq-z]/i.test(str)){
        return str.match(/[a-oq-z]/ig).length;
    }
    return 0;
}

function allIsChinese(str){
    var reg=/^[\u4E00-\u9FA5]{1,300}$/;
    return reg.test(str)
}

// getLetterLength('abc123_321CBA');//6


export default{
	getLetterLength:getLetterLength,
	allIsChinese:allIsChinese
}