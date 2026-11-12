exports.fromDiff=(diff)=>({kind:'diff',changeId:'diff',requirements:diff?[]:[],unknowns:diff?[]:['empty diff']});
