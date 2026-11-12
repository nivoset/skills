exports.fromTicket=(ticket)=>({kind:'ticket',changeId:ticket?.id||'ticket',requirements:ticket?.requirements||[],unknowns:ticket?.requirements?[]:['missing observable requirements']});
