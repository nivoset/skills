const crypto=require('node:crypto');
const {isApproved}=require('./approval');

const recipeHash=(recipe,canonicalize)=>crypto.createHash('sha256').update(canonicalize(recipe)).digest('hex');

function assertRecipeMatchesApprovedReview(recipe,review,approval,runId,canonicalize){
  if(!approval){
    throw Object.assign(new Error('operator approval required'),{code:'NEEDS_CLARIFICATION'});
  }
  const actual=recipeHash(recipe,canonicalize);
  if(!review?.recipeHash||review.recipeHash!==actual||approval?.recipeHash!==actual){
    throw Object.assign(new Error('recipe changed after review; regenerate and approve'),{code:'RECIPE_MUTATED'});
  }
  if(!isApproved(approval,review.featureHash,runId)){
    throw Object.assign(new Error('operator approval required'),{code:'NEEDS_CLARIFICATION'});
  }
  return actual;
}

module.exports={assertRecipeMatchesApprovedReview,recipeHash};
