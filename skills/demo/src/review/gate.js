const crypto=require('node:crypto');

const recipeHash=(recipe,canonicalize)=>crypto.createHash('sha256').update(canonicalize(recipe)).digest('hex');

module.exports={recipeHash};
