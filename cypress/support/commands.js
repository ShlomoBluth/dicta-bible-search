Cypress.Commands.add('setLanguageMode',(language)=>{
  cy.get('body').then(elem => {
    let languageMode
    if(language=='Hebrew'){
      languageMode='he'
    }else if(language=='English'){
      languageMode=''
    }
    let classAttr 
    if(elem.attr("class").substring(0,2)=='he'){
      classAttr=elem.attr("class").substring(0,2)
    }else{
      classAttr=''
    }
    if(classAttr!=languageMode)
    {
      cy.get('a').contains(/^English$|^עברית$/g).click();
    }
    if(languageMode=='he'){
      cy.get('a').contains(/^English$/).should('exist')
    } else{
      cy.get('a').contains(/^עברית$/).should('exist')
    }
  })
})


Cypress.Commands.add('hebrewSearchRun',({text,page=''})=>{
  cy.setLanguageMode('Hebrew')
  //if the start page
  if(page=='Start'){
    cy.get('[class*="home-logo-holder"]').should('contain','חיפוש בתנ"ך')
    cy.get('input[id="search_box"]').type(text)
    cy.get('button[id="mobile_search_button"]').click({force:true})
  }else{
    cy.get('span[class*="inner-header-logo-title"]').should('contain','חיפוש בתנ"ך')
    cy.get('input[class*="search-form-control"]').clear({force:true}).type(text,{force:true})
    cy.get('[class*="fa-search text"]').click({force:true})
  }
  cy.get('[class*="loader"]').should('not.exist')
})

Cypress.Commands.add('clearInput',()=>{
  cy.get('input[class*="search-form-control"]').clear({force:true})
  cy.get('[class*="fa-search text"]').click({force:true})
})

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


Cypress.Commands.add('resultList',(tests,data,textNumbers)=>{
  let res=[]
  //Number of result in the page
  cy.get('.result-list>li').then(list=>{
    res.push(list.length)
  })
  //Each result in the page
  cy.get('.result-list > li').each(result=>{
    if(tests=='wordForms'){
      cy.resultContainsWordsForm(data,result)
    }else if(tests=='wordFormsConsecutive'){
      cy.resultContainsConsecutiveWordsForm(data,result) 
    }
    else if(tests=='specific search'){
      cy.resultContainsSpecificWord(data,result)
    }else if(tests=='books'){
      cy.resultFromBooks(data,result)
    }
    else if(tests='selectedMeaningsAndSynonyms'){
      cy.ResultsOfSelectedMeaningsAndSynonyms(result,data)
    }
  }).then(()=>{
    res.push(textNumbers)
  }).then(()=>{
    return res
  })
})

Cypress.Commands.add('resultPagination',({tests='',data,textNumbers})=>{
  let numberOfPages
  let numOfResults=0
  cy.lastPage().then(lastPage=>{
    numberOfPages=lastPage
  }).then(()=>{
    cy.resultList(tests,data,textNumbers).then(res=>{
      numOfResults=numOfResults+res[0]
      textNumbers=res[1]
    }).then(()=>{
       //Loop through each page
      for(let i=2;i<=numberOfPages;i++){    
        cy.get('ul[class="pagination"] > li').last().children('button').click({force: true})
        cy.resultList(tests,data,textNumbers).then(res=>{
          numOfResults=numOfResults+res[0]
          textNumbers=res[1]
        })
      }
    })
  }).then(()=>{
    if(tests=='books'){
      //Each book appears as the number of times it has been written next to book
      for (let [key, value] of data) {
        expect(value).eq(0)
      }
    }
    if(textNumbers!==undefined){
      expect(textNumbers).eq(numOfResults)
    }
    //The number of results is equal to the number in the top
    cy.get('.f > span > :nth-child(2)').should('contain',numOfResults)
  })
})









//***************** */




 Cypress.Commands.add('lastPage',()=>{
  cy.get('[class*="pagination__item"]',{timeout:60000}).last().then($lastPage=>{
    return parseInt($lastPage.text())
  })
})

Cypress.Commands.add('existsInResult',(text)=>{
  //Recursive function through pages
  function existsInResults(text){
    return cy.existsInPageResult(text).then($exists=>{
      if($exists==true){
        return true
      }else{
        cy.get('[class*="pagination__navigation"]').last().then($lastPage=>{
          //If last page
          if($lastPage.attr('class').includes('disabled')){
            expect($exists).to.be.true
          }else{
            //Next page
            cy.get('[class*="pagination__navigation"]').last().click()
            return existsInResults(text)
          }
        })
      }
    })
  }
  existsInResults(text)
})

Cypress.Commands.add('existsInPageResult',(text)=>{
  let exists=false
  cy.get('.result-list').within(()=>{
    //Each bold word in results list
    cy.get('b').each($b=>{
      //If found text
      if($b.text()==text){
        exists=true
      }
    })
  }).then(()=>{
    return exists
  })
})

Cypress.Commands.add('resultContainsSpecificWord',(word,result)=>{
  let wordInResults
  let hasSpecificWord=false
  cy.get(result).within(()=>{
    //Each bold word in result
    cy.get('b').each($b=>{
      if($b.text().charAt(0)=='['||$b.text().charAt(0)=='('){
        wordInResults=$b.text().substring(1,$b.text().length-1)
      }else if($b.text().charAt($b.text().length)=='־'||
      $b.text().charAt($b.text().length)=='-'){
        wordInResults=$b.text().substring(0,$b.text().length-1)
      }else if($b.text().charAt(0)=='־'||$b.text().charAt(0)=='-'){
        wordInResults=$b.text().substring(1)
      }else{
        wordInResults=$b.text().trim()
      }
      //If found a bold word in result of the specific Word
      if(word==wordInResults){
        hasSpecificWord=true
      }
    }).then(()=>{
      //cy.log(wordInResults)
      expect(hasSpecificWord).to.be.true
    })
  })
})

Cypress.Commands.add('getTextNumbers',()=>{
  let textNumbers
  cy.get('[class="text-numbers"]').then($textNumbers=>{
    cy.get($textNumbers).should('not.contain','()').then(()=>{
      textNumbers=parseInt($textNumbers.text().substring(1,$textNumbers.text().length-1))
    })
  }).then(()=>{
    return textNumbers
  })
})

Cypress.Commands.add('loaderNotExist',()=>{
  cy.document().its('body').find('div.he').within(()=>{
    cy.get('[class*="loader"]').should('not.exist')
  })
})

Cypress.Commands.add('nomberOfResults',()=>{
  let number
  cy.document().its('body').find('div.he').within($body=>{
    cy.loaderNotExist().then(()=>{
      if($body.find('.result-list').length>0){
        //Results number in the top 
        cy.get('.f > span > :nth-child(2)').then(num=>{
          number=num.text().substring(2,num.text().length-2)
        })
      }else{
        number=0
      }
    })
  }).then(()=>{
    return number
  })
})











