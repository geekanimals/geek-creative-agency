/**
 * GOLD STANDARD CASE STUDY AGENT
 * PAYLOAD VALIDATOR
 */

export function validatePortfolioPayload(
 data:{
   title?:string;
   slug?:string;
   renderMode?:string;
 }
){

 const errors:string[]=[];


 if(!data.title?.trim()){
   errors.push("Missing title");
 }


 if(!data.slug?.trim()){
   errors.push("Missing slug");
 }


 if(
   data.renderMode &&
   ![
    "standard",
    "flexible",
    "flagship"
   ].includes(data.renderMode)
 ){
   errors.push(
    "Invalid renderMode",
   );
 }


 if(errors.length){
   throw new Error(
    errors.join("; "),
   );
 }


 return true;
}
