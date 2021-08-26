Cypress.Commands.add('showMeaningsAndSynonyms',()=>{
  cy.log("Show all meanings and synonyms")
  cy.contains(/Loading|טוען נתונים/g).should('not.exist')
  cy.contains('0 משמעויות נבחרו').should('not.exist')
  cy.get('#meanings_and_synonyms').then(elem=>{
    if(!elem.attr("class").includes('active')){
      cy.get('#meanings_and_synonyms > span').click({force:true})
    }
  })
  cy.get('body').within($body=>{
    //Open each word in the search list of meanings
    if($body.find('[class="inner-accordion-link"]').length>0){
      cy.get('[class="inner-accordion-link"]').each($meaning=>{
        cy.get($meaning).click({force:true})
      })
    }
  }).then(()=>{
    cy.get('body').within($body=>{
      if($body.find('[class="morebtn"]').length>0){
        cy.get('[class="morebtn"]').click({multiple:true,force: true})
      }
    }).then(()=>{
      cy.get('body').within($body=>{
        //Open Synonyms
        if($body.find('[class*=expand-area-text]').length>0){
          cy.get('[class*=expand-area-text]').click({multiple:true,force: true})
        }
      })
    })
  })
})


Cypress.Commands.add('eachMeaningTests',()=>{
  let word
    //Each word in the search list of meanings
    cy.get('ul[class="inner-ul"]').each($wordMeanings=>{
      cy.get($wordMeanings).within($meanings=>{
        //if list have more than 1 meaning
        if($meanings.find('[class*=selectAll]').length>0){
          cy.log("Unchecked select all of "+$meanings.text().split(' ')[4])
          cy.get('[class*=selectAll]').within(()=>{
            cy.get('[type="checkbox"]').uncheck({force: true})
            cy.get('[type="checkbox"]').should('not.be.checked')
            cy.loaderNotExist()
          })
          //Each meaning in the list
          cy.get('span[class="f-narkis"]').parent().each($meaning=>{
            cy.get($meaning).parent().within(()=>{
              let num
              cy.log('Check '+$meaning.text())
              cy.wrap($meaning.text(),{timeout:60000}).should('not.contain','()')
              cy.intercept('textAnalysis').as($meaning.text()+'checkreq')
              cy.get('[type="checkbox"]').check({force: true})
              //Number of results on the top
              cy.nomberOfResults().then(nomOfRes=>{
                num=nomOfRes
              }).then(()=>{
                cy.get('[class="text-numbers"]').should('contain',num)
              })
              cy.get('[type="checkbox"]').should('be.checked')
              cy.loaderNotExist()
            }).then(()=>{
              cy.get($meaning).within(()=>{
                cy.wait('@'+$meaning.text()+'checkreq').then(()=>{
                  cy.meaningTest()
                })
              })
            }).then(()=>{
              //Uncheck meaning
              cy.get($meaning).parent().within(()=>{
                cy.log('Uncheck '+$meaning.text())
                cy.get('[type="checkbox"]').uncheck({force: true})
                cy.get('[type="checkbox"]').should('not.be.checked')
                cy.loaderNotExist()
              })
            })
          })
          cy.get('[class*=selectAll]').within(()=>{
            word=$meanings.text().split(' ')[4]
            cy.log("Check select all of "+$meanings.text().split(' ')[4])
            cy.intercept('textAnalysis').as($meanings.text().split(' ')[4]+'selectallcheckreq')
            cy.get('[type="checkbox"]').check({force: true})
            cy.get('[type="checkbox"]').should('be.checked')
            cy.loaderNotExist()
          })
        }else{
          cy.wait('@'+word+'selectallcheckreq').then(()=>{
            cy.meaningTest()
          })
        }
      })
    })
})
  
Cypress.Commands.add('meaningTest',()=>{
  cy.getTextNumbers().then(textNumbers=>{
    if(textNumbers>0){
      cy.document().its('body').find('#app').within(()=>{
        cy.get('[class*="loader"]').should('not.exist')
        cy.eachSelectedMeaningsAndSynonymsMatrix().then(meaningsAndSynonymsMatrix=>{
          cy.resultPagination({
            tests:'selectedMeaningsAndSynonyms',
            data:meaningsAndSynonymsMatrix,
            textNumbers:textNumbers
          })
        })
      })
    }
  })
})
  
Cypress.Commands.add('eachSelectedMeaningsAndSynonymsMatrix',()=>{
    let meaningsMatrix=[]
    //Each word in the search list of meanings
    cy.get('ul[class="inner-ul"]').each($word=>{
      let meaningArr=[]
  
      //Word in search with list of meaning
      cy.get($word).within(()=>{
  
        //Each meaning
        cy.get('ul[class="slide-list"] > li').each($wordMeaning=>{
              
          cy.selectedMeaningWithSynonymArr($wordMeaning).then($meaningArr=>{
            let temp=meaningArr.concat($meaningArr)
            meaningArr=temp
          })
  
          
        }).then(()=>{
          meaningsMatrix.push(meaningArr)
        })
      })
    }).then(()=>{
      return meaningsMatrix
    })
})
  
Cypress.Commands.add('selectedMeaningWithSynonymArr',(wordMeaning)=>{
    let meaningArr=[]
    cy.get(wordMeaning).within($meaning=>{
      //if meaning has checkbox
      if($meaning.find('[class*="checkbox-indicator"]').length>0){
        cy.get('[class*="narkis-offset"]').children('[type="checkbox"]').then($checkbox=>{
          //if selected
          if($checkbox.prop('checked')){
            cy.getTextNumbers().then(textNumbers=>{
              if(textNumbers!=0){
                cy.getWordInAList().then(word=>{
                  meaningArr.push(word)
                })
              }
            })
          }
        })
      }else {
        cy.getTextNumbers().then(textNumbers=>{
          if(textNumbers!=0){
            cy.getWordInAList().then(word=>{
              meaningArr.push(word)
            })
          }
        })
      }
      cy.selectedSynonymArr($meaning).then(SynonymArr=>{
        let temp=meaningArr.concat(SynonymArr)
        meaningArr=temp
      })
    }).then(()=>{
      return meaningArr
    })
})
  
Cypress.Commands.add('selectedSynonymArr',(meaning)=>{
    let synonyms=[]
    cy.get(meaning).then(()=>{
      //if has synonyms
      if(meaning.find('[class="slider round"]').length>0){
        cy.get('[class="slider round"]').siblings('[type="checkbox"]').each($synonym=>{
          //if synonyms selected
          if($synonym.prop('checked')){
            cy.get($synonym).siblings('[class*="switch-text"]').then(text=>{
              synonyms.push(text.text())
            })
          }
        })
      }
    }).then(()=>{
      return synonyms
    })
})

Cypress.Commands.add('getResultListOfMeanings',($res)=>{
  let resLlistMeanings=new Array()
  cy.get($res).within(()=>{
    cy.get('[class*="list-collapse-btn hidden-mobile-view"] > img').each($listCollapseBtn=>{
      cy.getVerseListMeanings($listCollapseBtn).then(verseLlistMeanings=>{
        resLlistMeanings=resLlistMeanings.concat(verseLlistMeanings)
      })
    })
  }).then(()=>{
    return resLlistMeanings
  })
})

Cypress.Commands.add('getVerseListMeanings',($listCollapseBtn)=>{
  let verseLlistMeanings=new Array()
  cy.log("Collapse meanings")
  cy.get($listCollapseBtn).click({force: true})
  cy.get('a[class*="show-mobile-view"]').should('exist')
  //Each meaning   
  cy.get('[class="description-text"]').each($descriptionText=>{
    cy.get($descriptionText).then(text=>{
      verseLlistMeanings.push(text.text().substring(0,text.text().indexOf('(')-2))
    })
  })
  cy.get($listCollapseBtn).click({force: true}).then(()=>{
    return verseLlistMeanings
  })
})
  
Cypress.Commands.add('ResultsOfSelectedMeaningsAndSynonyms',(result,selectedMeaningsAndSynonyms)=>{
    let hasMeanings  
    cy.getResultListOfMeanings(result).then(listMeanings=>{
      //Loop through each word in search
      for(let i=0;i<selectedMeaningsAndSynonyms.length;i++){
        hasMeanings=false
        //Loop through list of meaning and Synonym of the word
        for(let j=0;j<selectedMeaningsAndSynonyms[i].length;j++){
          let meaning=listMeanings.find(x=>x===selectedMeaningsAndSynonyms[i][j])
          //If meaning or synonym found in results list of meanings
          if(meaning===selectedMeaningsAndSynonyms[i][j]){
            hasMeanings=true
            break
          }
        }
        if(hasMeanings==false){
          break
        }
      }
    }).then(()=>{
      cy.wrap(hasMeanings).should('be.true')
    })
})

Cypress.Commands.add('synonymsTests',()=>{
  //Each word in search
  cy.get('ul[class="inner-ul"]').each($wordMeanings=>{
    //Synonym of the word in search
    cy.get($wordMeanings).within($synonyms=>{
      //If has synonyms
      if($synonyms.find('[class="switch"]').length>0){
        //Each synonym 
        cy.get('[class="switch"]').each($synonym=>{
          cy.log($synonym.text()+" checked")
          cy.get($synonym).children('[type="checkbox"]').check({force: true})
          cy.get('[class*="loader"]').should('not.exist')
          cy.document().its('body').find('#app').within(()=>{
            cy.eachMeaningTests()
          })
          cy.log($synonym.text()+" unchecked")
          cy.get($synonym).children('[type="checkbox"]').uncheck({force: true})
        })
      }     
    })
  })
})
  
Cypress.Commands.add('selectSynonym',(synonym)=>{
  cy.get('[class*="switch-text"]').contains(synonym).siblings('[type="checkbox"]')
  .should('not.be.checked')
  cy.get('[class*="switch-text"]').contains(synonym).siblings('[type="checkbox"]')
  .check({force: true})
  cy.get('[class*="switch-text"]').contains(synonym).siblings('[type="checkbox"]')
  .should('be.checked')
  cy.loaderNotExist()
})

Cypress.Commands.add('getWordInAList',()=>{
  let word
  cy.get('[class="f-narkis"]').then($word=>{
    word=$word.text().substring(0,$word.text().length-1)
    return word
  })
})



