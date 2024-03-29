/// <reference types="cypress"/>

////run tests on requests from search run some in hebrew mode and english mode

let sizes = [[1000, 660]]//'iphone-x',

sizes.forEach((size) => {

  describe('DevelopmentVersionRequestsTests',()=>{

    
    beforeEach(() => {
      cy.screenSize({size:size})
      cy.visitpage({url:'/'})
    })
  
    
  
    
  
    it('Error message for textAnalysis response with a delay of 5 minutes when clicking the run button'+
    ' of search page in hebrew mode',()=>{
      cy.searchRequest({
        url:'/textAnalysis',
        language:'Hebrew',
        message:'אופס יש לנו בעיה נסו שנית, או בקרו באתר מאוחר יותר',
        delaySeconds:  60*5
      })
    })
  
    it('Error message for textAnalysis response with a delay of 5 minutes when clicking the run button'+
    ' of search page in english mode',()=>{
      cy.searchRequest({
        url:'/textAnalysis',
        language:'English',
        message:'Oops. Something went wrong Please try again later',
        delaySeconds: 60*5
      })
    })
  
    it('Error message for textAnalysis response with status code 500 when clicking the run button of search page'+
    ' in hebrew mode',()=>{
      cy.searchRequest({
        url:'/textAnalysis',
        language:'Hebrew',
        status:500,
        message:'אופס יש לנו בעיה נסו שנית, או בקרו באתר מאוחר יותר'
      })
    })
  
    it('Error message for textAnalysis response with status code 500 when clicking the run button of search page'+
    ' in english mode',()=>{
      cy.searchRequest({
        url:'/textAnalysis',
        language:'English',
        status:500,
        message:'Oops. Something went wrong Please try again later'
      })
    })
    
    
    it('Error message for search response with a delay of 5 minutes when clicking the run button'+
    ' of search page in hebrew mode',()=>{
      cy.searchRequest({
        url:'/search',
        language:'Hebrew',
        message:'אופס יש לנו בעיה נסו שנית, או בקרו באתר מאוחר יותר',
        delaySeconds:  60*5
      })
    })
  
    it('Error message for search response with a delay of 5 minutes when clicking the run button'+
    ' of search page in english mode',()=>{
      cy.searchRequest({
        url:'/search',
        language:'English',
        message:'Oops. Something went wrong Please try again later',
        delaySeconds: 60*5
      })
    })
  
    it('Error message for search response with status code 500 when clicking the run button of search page'+
    ' in hebrew mode',()=>{
      cy.searchRequest({
        url:'/search',
        language:'Hebrew',
        status:500,
        message:'אופס יש לנו בעיה נסו שנית, או בקרו באתר מאוחר יותר'
      })
    })
  
    it('Error message for search response with status code 500 when clicking the run button of search page'+
    ' in english mode',()=>{
      cy.searchRequest({
        url:'/search',
        language:'English',
        status:500,
        message:'Oops. Something went wrong Please try again later'
      })
    })
  
  
  
    it('Error message for books response with a delay of 5 minutes when clicking the run button'+
    ' of search page in hebrew mode',()=>{
      cy.searchRequest({
        url:'/books',
        language:'Hebrew',
        message:'אופס יש לנו בעיה נסו שנית, או בקרו באתר מאוחר יותר',
        delaySeconds:  60*5
      })
    })
  
    it('Error message for books response with a delay of 5 minutes when clicking the run button'+
    ' of search page in english mode',()=>{
      cy.searchRequest({
        url:'/books',
        language:'English',
        message:'Oops. Something went wrong Please try again later',
        delaySeconds: 60*5
      })
    })
  
    it('Error message for books response with status code 500 when clicking the run button of search page'+
    ' in hebrew mode',()=>{
      cy.searchRequest({
        url:'/books',
        language:'Hebrew',
        status:500,
        message:'אופס יש לנו בעיה נסו שנית, או בקרו באתר מאוחר יותר'
      })
    })
  
    it('Error message for books response with status code 500 when clicking the run button of search page'+
    ' in english mode',()=>{
      cy.searchRequest({
        url:'/books',
        language:'English',
        status:500,
        message:'Oops. Something went wrong Please try again later'
      })
    })  
     
  
    
    it('Error message for wordforms response with a delay of 5 minutes when clicking the run button'+
    ' of search page in hebrew mode',()=>{
      cy.searchRequest({
        url:'/wordforms',
        language:'Hebrew',
        message:'אופס יש לנו בעיה נסו שנית, או בקרו באתר מאוחר יותר',
        delaySeconds:  60*5
      })
    })
  
    it('Error message for wordforms response with a delay of 5 minutes when clicking the run button'+
    ' of search page in english mode',()=>{
      cy.searchRequest({
        url:'/wordforms',
        language:'English',
        message:'Oops. Something went wrong Please try again later',
        delaySeconds: 60*5
      })
    })
  
    it('Error message for wordforms response with status code 500 when clicking the run button of search page'+
    ' in hebrew mode',()=>{
      cy.searchRequest({
        url:'/wordforms',
        language:'Hebrew',
        status:500,
        message:'אופס יש לנו בעיה נסו שנית, או בקרו באתר מאוחר יותר'
      })
    })
  
    it('Error message for wordforms response with status code 500 when clicking the run button of search page'+
    ' in english mode',()=>{
      cy.searchRequest({
        url:'/wordforms',
        language:'English',
        status:500,
        message:'Oops. Something went wrong Please try again later'
      })
    })
    
    it('Error message for related response with a delay of 5 minutes when clicking the run button'+
    ' of search page in hebrew mode',()=>{
      cy.searchRequest({
        url:'/related',
        language:'Hebrew',
        message:'אופס יש לנו בעיה נסו שנית, או בקרו באתר מאוחר יותר',
        delaySeconds:  60*5
      })
    })
  
    it('Error message for related response with a delay of 5 minutes when clicking the run button'+
    ' of search page in english mode',()=>{
      cy.searchRequest({
        url:'/related',
        language:'English',
        message:'Oops. Something went wrong Please try again later',
        delaySeconds: 60*5
      })
    })
  
    it('Error message for related response with status code 500 when clicking the run button of search page'+
    ' in hebrew mode',()=>{
      cy.searchRequest({
        url:'/related',
        language:'Hebrew',
        status:500,
        message:'אופס יש לנו בעיה נסו שנית, או בקרו באתר מאוחר יותר'
      })
    })
  
    it('Error message for related response with status code 500 when clicking the run button of search page'+
    ' in english mode',()=>{
      cy.searchRequest({
        url:'/related',
        language:'English',
        status:500,
        message:'Oops. Something went wrong Please try again later'
      })
    })
  
    it('Error message for lexemes response with a delay of 5 minutes when clicking the run button'+
    ' of search page in hebrew mode',()=>{
      cy.searchRequest({
        url:'/lexemes',
        language:'Hebrew',
        message:'אופס יש לנו בעיה נסו שנית, או בקרו באתר מאוחר יותר',
        delaySeconds:  60*5
      })
    })
  
    it('Error message for lexemes response with a delay of 5 minutes when clicking the run button'+
    ' of search page in english mode',()=>{
      cy.searchRequest({
        url:'/lexemes',
        language:'English',
        message:'Oops. Something went wrong Please try again later',
        delaySeconds: 60*5
      })
    })
  
    it('Error message for lexemes response with status code 500 when clicking the run button of search page'+
    ' in hebrew mode',()=>{
      cy.searchRequest({
        url:'/lexemes',
        language:'Hebrew',
        status:500,
        message:'אופס יש לנו בעיה נסו שנית, או בקרו באתר מאוחר יותר'
      })
    })
  
    it('Error message for lexemes response with status code 500 when clicking the run button of search page'+
    ' in english mode',()=>{
      cy.searchRequest({
        url:'/lexemes',
        language:'English',
        status:500,
        message:'Oops. Something went wrong Please try again later'
      })
    })  
  
      
  
      
      
  })
})

