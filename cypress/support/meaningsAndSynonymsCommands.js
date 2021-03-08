Cypress.Commands.add('showMeaningsAndSynonyms',()=>{
  cy.contains('טוען נתונים').should('not.exist')
  cy.get('#meanings_and_synonyms').then(elem=>{
    if(!elem.attr("class").includes('active')){
      cy.get('#meanings_and_synonyms > span').click()
    }
  })
  cy.get('body').within($body=>{
    //Open each word in the search list of meanings
    if($body.find('[class="inner-accordion-link"]').length>0){
      cy.get('[class="inner-accordion-link"]').each($meaning=>{
        cy.get($meaning).click()
      })
    }
  }).then(()=>{
    cy.get('body').within($body=>{
      if($body.find('[class="morebtn"]').length>0){
        cy.get('[class="morebtn"]').click({multiple:true})
      }
    }).then(()=>{
      cy.get('body').within($body=>{
        //Open Synonyms
        if($body.find('[class*=expand-area-text]').length>0){
          cy.get('[class*=expand-area-text]').click({multiple:true})
        }
      })
    })
  })
})

Cypress.Commands.add('closeMeaningsAndSynonyms',()=>{
  cy.get('body').within($body=>{
    //Close Synonyms
    if($body.find('[class*=expand-area-text]').length>0){
      cy.get('[class*=expand-area-text]').click({multiple:true})
    }
  }).then(()=>{
    cy.get('body').within($body=>{
      if($body.find('[class="morebtn"]').length>0){
        cy.get('[class="morebtn"]').click({multiple:true})
      }
    })
  }).then(()=>{
    cy.get('body').within($body=>{
      //Close each word in the search list of meanings
      if($body.find('[class="inner-accordion-link"]').length>0){
        cy.get('[class="inner-accordion-link"]').each($meaning=>{
          cy.get($meaning).click()
        })
      }
    })
  })
  cy.get('#meanings_and_synonyms').then(elem=>{
    if(!elem.attr("class").includes('active')){
      cy.get('#meanings_and_synonyms > span').click()
    }
  })
})

Cypress.Commands.add('eachMeaningTests',()=>{
    //Each word in the search list of meanings
    cy.get('ul[class="inner-ul"]').each($wordMeanings=>{
      cy.get($wordMeanings).within($meanings=>{
        //if list have more than 1 meaning
        if($meanings.find('[class*=selectAll]').length>0){
          cy.get('[class*=selectAll]').within(()=>{
            cy.get('[type="checkbox"]').uncheck({force: true})
            cy.get('[type="checkbox"]').should('not.be.checked')
            cy.loaderNotExist()
          })
          //Each meaning in the list
          cy.get('span[class="f-narkis"]').parent().each($meaning=>{
            cy.get($meaning).parent().within(()=>{
              let num
              cy.get('[type="checkbox"]').check({force: true})
              cy.nomberOfResults().then(nomOfRes=>{
                num=nomOfRes
              }).then(()=>{
                cy.get('[class="text-numbers"]').should('contain',num)
              })
              cy.get('[type="checkbox"]').should('be.checked')
              cy.loaderNotExist()
            }).then(()=>{
              cy.get($meaning).within(()=>{
                cy.meaningTest()
              })
            }).then(()=>{
              cy.get($meaning).parent().within(()=>{
                cy.get('[type="checkbox"]').uncheck({force: true})
                cy.get('[type="checkbox"]').should('not.be.checked')
                cy.loaderNotExist()
              })
            })
          })
          cy.get('[class*=selectAll]').within(()=>{
            cy.get('[type="checkbox"]').check({force: true})
            cy.get('[type="checkbox"]').should('be.checked')
            cy.loaderNotExist()
          })
        }else{
          cy.meaningTest()
        }
      })
    })
})
  
Cypress.Commands.add('meaningTest',()=>{
  cy.getTextNumbers().then(textNumbers=>{
    if(textNumbers>0){
      cy.document().its('body').find('div.he').within(()=>{
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
            cy.getWordInAList().then(word=>{
              meaningArr.push(word)
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
  //cy.wait(100)
  cy.get($listCollapseBtn).click({force: true})  
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
      for(let i=0;i<selectedMeaningsAndSynonyms.length;i++){
        hasMeanings=false
        for(let j=0;j<selectedMeaningsAndSynonyms[i].length;j++){
          let meaning=listMeanings.find(x=>x===selectedMeaningsAndSynonyms[i][j])
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
      expect(hasMeanings).eq(true)
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

Cypress.Commands.add('getWordInAList',()=>{
  let word
  cy.get('[class="f-narkis"]').then($word=>{
    word=$word.text().substring(0,$word.text().length-1)
    return word
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
        cy.get('.f > span > :nth-child(2)').then(num=>{
          cy.log(num.text())
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
