Cypress.Commands.add('removeTaamim',()=>{
  cy.get('[class*="text-select f-narkis"]').click()
})


Cypress.Commands.add('searchRequest',({url,language,status=200,message='',delaySeconds=0})=>{
  cy.intercept('POST', '**'+url+'**', {
    delayMs:1000*delaySeconds,
    statusCode: status
  })
  cy.setLanguageMode(language)
  if(message.length>0){
    cy.contains(message,{timeout:1000*delaySeconds}).should('not.exist')
  }  
  cy.searchRun('בראשית ברא')

  if(delaySeconds>0){
    cy.get('body').then(($body) => {
      cy.get('[class*="loader"]',{timeout:1000*delaySeconds}).should('not.exist')
      cy.contains(/Loading|טוען נתונים/g,{timeout:1000*delaySeconds}).should('not.exist')
    })
  }

  if(message.length>0){
    cy.contains(message).should('exist')
  }  

   
})


















