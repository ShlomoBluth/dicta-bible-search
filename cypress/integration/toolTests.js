///<reference types="cypress"/>


const path = require('path')



const urls = new Map();
urls.set('live',Cypress.env('LIVE_URL'))
urls.set('dev',Cypress.env('DEV_URL')) 

const sizes= new Map();
sizes.set('desktop',[1000, 660])
sizes.set('mobile','iphone-x')


urls.forEach((urlValue,urlKey)=>{

    sizes.forEach((sizeValue,sizeKey) => {

    
        describe('bible-search-tests '+urlKey+' '+sizeKey,()=>{
    
            beforeEach(() => {
                cy.screenSize({size:sizeValue})
                cy.visitpage({url:urlValue})
            })


            it('Each result contains at least one word form of each search word',()=>{
                cy.searchRun({text:'יום השישי',collection:'תנ"ך',language:'Hebrew'})
                cy.theFormOfTheText('עם ניקוד')
                cy.showAllWordForms()
                cy.eachSelectedWordFormMatrix().then(selectedWordFormMatrix=>{
                    //For the first word in the search has 12 words form
                    expect(selectedWordFormMatrix[0].length).eq(12)
                    //For the second word in the search has 2 words form
                    expect(selectedWordFormMatrix[1].length).eq(2)
                    cy.resultPagination({
                        tests:'wordForms',
                        data:selectedWordFormMatrix
                    })
                })
            })
        
            it('Removal of word form',()=>{
                cy.searchRun({text:'יום השישי',collection:'תנ"ך',language:'Hebrew'})
                cy.theFormOfTheText('עם ניקוד')
                cy.showAllWordForms()
                //The number in the top has 12
                cy.get('.f > span > :nth-child(2)').should('contain',12)
                //Removal of בַּיֹּום
                cy.get('li').contains('בַּיּוֹם').within(()=>{
                    cy.get('[type="checkbox"]').uncheck({force: true})
                })
                cy.get('[class*="loader"]').should('not.exist')
                //The number in the top has 11
                cy.get('.f > span > :nth-child(2)').should('contain',11)
                cy.eachSelectedWordFormMatrix().then(selectedWordFormMatrix=>{
                    //For the first word in the search has 11 words form    
                    expect(selectedWordFormMatrix[0].length).eq(11)
                    //For the second word in the search has 2 words form
                    expect(selectedWordFormMatrix[1].length).eq(2)
                    cy.resultPagination({
                        tests:'wordForms',
                        data:selectedWordFormMatrix
                    })
                })
                //Check of בַּיֹּום
                cy.get('li').contains('בַּיּוֹם').within(()=>{
                    cy.get('[type="checkbox"]').check({force: true})
                })
            })
                
               
            
            it('Each word form appears in the results as the number of times it has been written next to word form',()=>{
                cy.searchRun({text:'צבי',collection:'תנ"ך',language:'Hebrew'})
                cy.theFormOfTheText('עם ניקוד')
                cy.showAllWordForms()
                cy.wordFormsWithNumberOfAppearances()
            })
        
            it('A pair of words that come one after the other',()=>{
                cy.searchRun({text:'שלום בית',collection:'תנ"ך',language:'Hebrew'})
                cy.theFormOfTheText('עם ניקוד')
                //Number of results
                cy.get('.f > span > :nth-child(2)').then($numberOfResults=>{
                    expect(parseInt($numberOfResults.text())).to.eq(116)
                })
                cy.visitpage({url:urlValue})
                cy.searchRun({text:'"שלום בית"',collection:'תנ"ך',language:'Hebrew'})
                cy.theFormOfTheText('עם ניקוד')
                cy.sortedByRelevance()
                
                //Number of results
                cy.get('.f > span > :nth-child(2)').then($numberOfResults=>{
                    expect(parseInt($numberOfResults.text())).to.eq(2)
                }).then(()=>{
                    cy.showAllWordForms().then(()=>{
                        //Wait for word forms to update 
                        cy.get('[class="control control--checkbox"]').should('have.length',7)
                        cy.consecutiveWordsFormsArray().then(consecutiveWordFormsArray=>{
                            cy.log(consecutiveWordFormsArray[8])
                            cy.resultPagination({
                                tests:'wordFormsConsecutive',
                                data:consecutiveWordFormsArray
                            })
                        })
                    })
                })
            })
        
            it('Each result contains the specific word',()=>{
                cy.searchRun({text:'לַאֲרָיוֹת',collection:'תנ"ך',language:'Hebrew'})
                cy.theFormOfTheText('עם ניקוד')
                    cy.resultPagination({
                        tests: 'specific search',
                        data:'לַאֲרָיוֹת'
                 })
            })
        
            
        
           
        
            it('Each book appears in the results as the number of times it has been written next to book',()=>{
                cy.searchRun({text:'יום השישי',collection:'תנ"ך',language:'Hebrew'})
                cy.theFormOfTheText('עם ניקוד')
                cy.showBooks()
                cy.selectedBooksMap().then(selectedBooks=>{
                    //Number of books is 7    
                    expect(selectedBooks.size).eq(7)
                    cy.resultPagination({
                        tests:'books',
                        data:selectedBooks
                    })
                })
            })
        
            it('Removal of book',()=>{
                cy.searchRun({text:'יום השישי',collection:'תנ"ך',language:'Hebrew'})
                cy.theFormOfTheText('עם ניקוד')
                cy.showBooks()
                //remove book שמות
                cy.get('[class="slide-li"]').contains('ספר שמות').within(()=>{
                    cy.get('[type="checkbox"]').uncheck({force: true})
                    cy.get('[type="checkbox"]').should('not.be.checked')
                })
                cy.selectedBooksMap().then(selectedBooks=>{
                    //Number of books is 6
                    expect(selectedBooks.size).eq(6)
                    cy.resultPagination({
                        tests:'books',
                        data:selectedBooks
                    })
                })
            })
        
            it('Removal of collection',()=>{
                cy.searchRun({text:'יום השישי',collection:'תנ"ך',language:'Hebrew'})
                cy.theFormOfTheText('עם ניקוד')
                cy.showBooks()
                //remove collection תורה
                cy.get('span').contains('תורה').parent('a').siblings('[class*="inner-accordion-content"]')
                .within(()=>{
                    cy.get('[class*="selectAll"]').within(()=>{
                        cy.get('[type="checkbox"]').uncheck({force: true})
                        cy.get('[type="checkbox"]').should('not.be.checked')
                    })
                })
                cy.selectedBooksMap().then(selectedBooks=>{
                    //Number of books is 4
                    expect(selectedBooks.size).eq(4)
                    cy.resultPagination({
                        tests:'books',
                        data:selectedBooks
                    })
                })
            })
        
        
            it('Each result has at least one meaning of each search word',()=>{
                cy.searchRun({text:'יום השישי',collection:'תנ"ך',language:'Hebrew'})
                cy.theFormOfTheText('עם ניקוד')
                cy.showMeaningsAndSynonyms()
                cy.eachSelectedMeaningsAndSynonymsMatrix().then(meaningsAndSynonymsMatrix=>{
                    cy.resultPagination({
                        tests:'selectedMeaningsAndSynonyms',
                        data:meaningsAndSynonymsMatrix
                    })
                })
            })
        
            it('Each meaning appears in the results as the number of times it has been written next to meaning',()=>{
                cy.searchRun({text:'הבל הבלים',collection:'תנ"ך',language:'Hebrew'})
                cy.theFormOfTheText('עם ניקוד')
                cy.showMeaningsAndSynonyms()
                cy.eachMeaningTests() 
            })
        
            it('Each meaning and synonym appears in the results as the number of times it has been written'+
            ' next to meaning',()=>{
                cy.searchRun({text:'הבל הבלים',collection:'תנ"ך',language:'Hebrew'})
                cy.theFormOfTheText('עם ניקוד')
                cy.showMeaningsAndSynonyms()
                cy.synonymsTests()
            })
        
            it('Each result has at least one meaning or synonym of each search word',()=>{
                let numberOfResults
                cy.searchRun({text:'צבי',collection:'תנ"ך',language:'Hebrew'})
                cy.theFormOfTheText('עם ניקוד')
                //num of results befor synonyms
                cy.get('.f > span > :nth-child(2)').then($numberOfResults=>{
                    numberOfResults=parseInt($numberOfResults.text())
                }).then(()=>{
                    cy.showMeaningsAndSynonyms()
                    cy.selectSynonym('עֹפֶר')
                    cy.selectSynonym('צָבָא')
                }).then(()=>{
                    //num of results after synonyms
                    cy.get('.f > span > :nth-child(2)').then($numberOfResults=>{
                        expect(parseInt($numberOfResults.text())).to.greaterThan( numberOfResults)
                    })
                }).then(()=>{
                    cy.eachSelectedMeaningsAndSynonymsMatrix().then(meaningsAndSynonymsMatrix=>{
                        cy.resultPagination({
                            tests:'selectedMeaningsAndSynonyms',
                            data:meaningsAndSynonymsMatrix
                        })
                    })
                })
            })
        
            // ////////////////////////////////////////////////////////////////////////////////
        
            it('Removal of meaning',()=>{
                cy.searchRun({text:'אריה',collection:'תנ"ך',language:'Hebrew'})
                cy.theFormOfTheText('עם ניקוד')
                cy.showMeaningsAndSynonyms()
                //cy.intercept('**').as('requests')
                cy.get('li[class="slide-li"]').contains('אֲרִי').within(()=>{
                    cy.get('[type="checkbox"]').uncheck({force: true})
                    cy.get('[type="checkbox"]').should('not.be.checked')
                }).then(()=>{
                    cy.get('[class*="loader"]').should('not.exist')
                    //Check meanings update
                    cy.get('[class*="collapse-btn"]').first().click({force: true}).then(()=>{
                        cy.get('[class="description-text"]').should('have.length',15)
                    })
                    cy.get('[class*="collapse-btn"]').first().click({force: true})
                    cy.eachSelectedMeaningsAndSynonymsMatrix().then(meaningsAndSynonymsMatrix=>{
                        cy.resultPagination({
                            tests:'selectedMeaningsAndSynonyms',
                            data:meaningsAndSynonymsMatrix
                        })
                    })
                })       
            })
        
           
        
        
            it('No meanings but there are synonyms',()=>{
                cy.searchRun({text:'ששון חדווה',collection:'תנ"ך',language:'Hebrew'})
                cy.theFormOfTheText('עם ניקוד')
                //Results not exist
                cy.get('[class="result-list"]').should('not.exist').then(()=>{
                    cy.showMeaningsAndSynonyms()
                    //Select synonyms of the word
                    cy.get('[class="inner-ul"]').first().next().within(()=>{
                        cy.selectSynonym('רִנָּה')
                    })
                    cy.sortedByRelevance()
                    cy.get('[class="inner-ul"]').first().next().within(()=>{
                        cy.selectSynonym('גִּילָה')
                    })
                    cy.sortedByRelevance()
                    // cy.get('span[class="f-narkis"]').contains('שָׂשֹׂון').siblings('[class="text-numbers"]')
                    // .should('contain','(6)')
                }).then(()=>{
                     //The number in the top has 6
                     cy.get('.f > span > :nth-child(2)').then($numberOfResults=>{
                        cy.wrap(parseInt($numberOfResults.text())).should('eq',6)
                    })
                })
                cy.eachSelectedMeaningsAndSynonymsMatrix().then(meaningsAndSynonymsMatrix=>{
                    cy.resultPagination({tests:'selectedMeaningsAndSynonyms',data:meaningsAndSynonymsMatrix})
                })
            })
        
            // ////////////////////////////////////////////////////////////////////////
        
            it('Search with root words',()=>{
                cy.searchRun({text:'ברא',collection:'תנ"ך',language:'Hebrew'})
                cy.theFormOfTheText('עם ניקוד')
                cy.existsInResult('וַיִּבְרָא')
            })
        
            it('search full spelling and also get partial spelling results',()=>{
                cy.searchRun({text:'דָּוִיד',collection:'תנ"ך',language:'Hebrew'})
                cy.theFormOfTheText('עם ניקוד')
                cy.existsInResult('דָוִד')
            })
        
            it('search partial spelling and also get full spelling results',()=>{
                cy.searchRun({text:'דָוִד',collection:'תנ"ך',language:'Hebrew'})
                cy.theFormOfTheText('עם ניקוד')
                cy.existsInResult('דָּוִיד')
            })
        
            // // it('Second person',()=>{
            // //     cy.searchRun({text:'אֹתְכָה',collection:'תנ"ך',language:'Hebrew'})
            // //     cy.theFormOfTheText('עם ניקוד')
            // //     cy.existsInResult('אֹותְךָ')
            // // })
        
            it('Different suffixes second person that does not end with "ה"',()=>{
                cy.searchRun({text:'אֹותְךָ',collection:'תנ"ך',language:'Hebrew'})
                cy.theFormOfTheText('עם ניקוד')
                cy.existsInResult('אֹתְכָה')
            })
        
            // // it('Second person, female',()=>{
            // //     cy.searchRun({text:'גַּרְתָּה',collection:'תנ"ך',language:'Hebrew'})
            // //     cy.theFormOfTheText('עם ניקוד')
            // //     cy.existsInResult('גַּרְתָּ')
            // // })
        
            it('Different suffixes second person, female that does not end with "ה"',()=>{
                cy.searchRun({text:'גַּרְתָּ',collection:'תנ"ך',language:'Hebrew'})
                cy.theFormOfTheText('עם ניקוד')
                cy.existsInResult('גַּרְתָּה')
            })
        
            // // it('Third person',()=>{
            // //     cy.searchRun({text:'כֻּלֹּה',collection:'תנ"ך',language:'Hebrew'})
            // //     cy.theFormOfTheText('עם ניקוד')
            // //     cy.existsInResult('כֻּלֹּו')
            // // })
        
            it('Different suffixes third person that does not end with "ה"',()=>{
                cy.searchRun({text:'כֻּלֹּו',collection:'תנ"ך',language:'Hebrew'})
                cy.theFormOfTheText('עם ניקוד')
                cy.existsInResult('כֻּלֹּה')
            })
        
            it('Search additional א and also get missing א results',()=>{
                cy.searchRun({text:'ונטמאתם',collection:'תנ"ך',language:'Hebrew'})
                cy.theFormOfTheText('עם ניקוד')
                cy.existsInResult('וְנִטְמֵתֶם')
            })
        
            it('Search additional א and also get missing א results',()=>{
                cy.searchRun({text:'מראשית',collection:'תנ"ך',language:'Hebrew'})
                cy.theFormOfTheText('עם ניקוד')
                cy.existsInResult('מֵרֵשִׁית')
            })
        
        
            it('Search missing א and also get additional א results',()=>{
                cy.searchRun({text:'ורציתי',collection:'תנ"ך',language:'Hebrew'})
                cy.theFormOfTheText('עם ניקוד')
                cy.existsInResult('וְרָצִאתִי')
            })
        
            // // it('Search missing א and also get additional א results',()=>{
            // //     cy.searchRun({text:'מֵרֵשִׁית',collection:'תנ"ך',language:'Hebrew'})
            // //     cy.theFormOfTheText('עם ניקוד')
            // //     cy.existsInResult('מֵרֵאשִׁית')
            // // })
        
        
            it('Search missing ה and also get additional ה results',()=>{
                cy.searchRun({text:'כָּמֹוךָ',collection:'תנ"ך',language:'Hebrew'})
                cy.theFormOfTheText('ללא ניקוד')
                cy.existsInResult('כמכה')
            })
        
            // // it('Additional ה',()=>{
            // //     cy.searchRun({text:'כָמֹכָה',collection:'תנ"ך',language:'Hebrew'})
            // //     cy.theFormOfTheText('עם ניקוד')
            // //     cy.existsInResult('כָּמֹוךָ')
            // // })
        
            it('Search a word that ends with א and also get that word that ends with ה',()=>{
                cy.searchRun({text:'ימלא',collection:'תנ"ך',language:'Hebrew'})
                cy.theFormOfTheText('עם ניקוד')
                cy.existsInResult('יְמַלֵּה') 
            })
        
            it('Search a word that ends with ם and also get that word that ends with ן',()=>{
                cy.searchRun({text:'חטים',collection:'תנ"ך',language:'Hebrew'})
                cy.theFormOfTheText('עם ניקוד')
                cy.existsInResult('חִטִּין') 
            })
        
            // // // it('Interchangeable letters',()=>{
            // // //     cy.searchRun({text:'יְמַלֵּה',collection:'תנ"ך',language:'Hebrew'})
            // // //     cy.theFormOfTheText('עם ניקוד')
            // // //     cy.existsInResult('יִמָּלֵא')
            // // // })
        
            it('Search a word with ס and also get that word with replace of ס with ש',()=>{
                cy.searchRun({text:'וארסתיך',collection:'תנ"ך',language:'Hebrew'})
                cy.theFormOfTheText('עם ניקוד')
                cy.existsInResult('וְאֵרַשְׂתִּיךְ') 
            })
        
            it('Different ways the bible refers to G-d',()=>{
                cy.searchRun({text:'א-להים',collection:'תנ"ך',language:'Hebrew'})
                cy.theFormOfTheText('עם ניקוד')
                cy.existsInResult('הָאֱלֹהִים')
                // cy.searchRun({text:'ה\'',language:'Hebrew'})
                // cy.existsInResult('הָאֱלֹהִים')
            })
        
            it('Search with numbers',()=>{
                cy.searchRun({text:'127',collection:'תנ"ך',language:'Hebrew'})
                cy.theFormOfTheText('עם ניקוד')
                cy.existsInResult('מֵאָה')
                cy.existsInResult('וְעֶשְׂרִים')
                cy.existsInResult('וְשֶׁבַע')
            })
        
            it('No nikud',()=>{
                cy.searchRun({text:'בראשית ברא',collection:'תנ"ך',language:'Hebrew'})
                cy.theFormOfTheText('ללא ניקוד')
                cy.get('[class="result-li"]').first().should('contain','בראשית ברא')
            })
        
            it('With nikud',()=>{
                cy.searchRun({text:'בראשית ברא',collection:'תנ"ך',language:'Hebrew'})
                cy.theFormOfTheText('עם ניקוד')
                cy.get('[class="result-li"]').first().should('contain','בְּרֵאשִׁית בָּרָא')
            })
        
            it('With nikud and Taamim',()=>{
                cy.searchRun({text:'בראשית ברא',collection:'תנ"ך',language:'Hebrew'})
                cy.theFormOfTheText('ניקוד וטעמים')
                cy.get('[class="result-li"]').first().should('contain','בְּרֵאשִׁ֖ית בָּרָ֣א')
            })
        
        
            it('Increasing the font',()=>{
                let fontSize
                cy.searchRun({text:'בראשית ברא',collection:'תנ"ך',language:'Hebrew'})
                cy.fontSize().then(size=>{
                    fontSize=size
                })
                cy.get('[class*=fa-search-plus]').click({force: true})
                cy.fontSize().then(size=>{
                    cy.wrap(size).should('be.gt',fontSize)
                })
                cy.get('[class*=fa-search-minus]').click({force: true})
            })
        
            it('Font reduction',()=>{
                let fontSize
                cy.searchRun({text:'בראשית ברא',collection:'תנ"ך',language:'Hebrew'})
                cy.fontSize().then(size=>{
                    fontSize=size
                })
                cy.get('[class*=fa-search-minus]').click({force: true})
                cy.fontSize().then(size=>{
                    cy.wrap(size).should('be.lt',fontSize)
                })
                cy.get('[class*=fa-search-plus]').click({force: true})
            })
        
            it('10 results per page',()=>{
                cy.searchRun({text:'דוד',collection:'תנ"ך',language:'Hebrew'})
                cy.numberOfResultInPage('10')
                cy.get('[class="result-li"]').should('have.length',10)
            })
        
            it('50 results per page',()=>{
                cy.searchRun({text:'דוד',collection:'תנ"ך',language:'Hebrew'})
                cy.numberOfResultInPage('50')
                cy.get('[class="result-li"]').should('have.length',50)
            })
        
            it('100 results per page',()=>{
                cy.searchRun({text:'דוד',collection:'תנ"ך',language:'Hebrew'})
                cy.numberOfResultInPage('100')
                cy.get('[class="result-li"]').should('have.length',100)
            })
        
            
            it('HTML download',()=>{
                cy.searchRun({text:'יום השישי',collection:'תנ"ך',language:'Hebrew'})
                cy.removeDownloadsFiles()
                cy.downloadFile({type:'HTML'}).then(()=>{
                    cy.validateFile({
                        type:'html',
                        resNum:12,
                        collection:'תנ"ך'
                    })
                })
            })
        
            it('HTML download do not include the שמות קדושים', { browser: '!firefox' },()=>{
                cy.searchRun({text:'א-להים',collection:'תנ"ך',language:'Hebrew'})
                cy.theFormOfTheText('עם ניקוד')
                cy.removeDownloadsFiles()
                cy.downloadFile({type:'HTML',shemotKdoshim:true}).then(()=>{
                    cy.fileDoesNotContain({type:'html',text:'אֱלֹהִים'})
                })
            })
        
            
            it('TXT download',()=>{
                cy.searchRun({text:'יום השישי',collection:'תנ"ך',language:'Hebrew'})
                cy.removeDownloadsFiles()
                cy.downloadFile({type:'TXT'}).then(()=>{
                    cy.validateFile({
                        type:'txt',
                        resNum:12,
                        collection:'תנ"ך'
                    })
                })
            })
        
            it('TXT download do not include the שמות קדושים', { browser: '!firefox' },()=>{
                cy.searchRun({text:'א-להים',collection:'תנ"ך',language:'Hebrew'})
                cy.theFormOfTheText('עם ניקוד')
                cy.removeDownloadsFiles()
                cy.downloadFile({type:'TXT',shemotKdoshim:true}).then(()=>{
                    cy.fileDoesNotContain({type:'txt',text:'אֱלֹהִים'})
                })
            })
        
            it('CSV download',()=>{
                cy.searchRun({text:'יום השישי',collection:'תנ"ך',language:'Hebrew'})
                cy.removeDownloadsFiles()
                cy.downloadFile({type:'CSV'}).then(()=>{
                    cy.validateFile({
                        type:'csv',
                        resNum:12,
                        collection:'תנ"ך'
                    })
                })
            })
        
            it('CSV download do not include the שמות קדושים', { browser: '!firefox' },()=>{
                cy.searchRun({text:'א-להים',collection:'תנ"ך',language:'Hebrew'})
                cy.theFormOfTheText('עם ניקוד')
                cy.removeDownloadsFiles()
                cy.downloadFile({type:'CSV',shemotKdoshim:true}).then(()=>{
                    cy.fileDoesNotContain({type:'csv',text:'אֱלֹהִים'})
                })
            })
        
            it('Word download',()=>{
                cy.searchRun({text:'יום השישי',collection:'תנ"ך',language:'Hebrew'})
                cy.removeDownloadsFiles()
                cy.downloadFile({type:'Word'}).then(()=>{
                    //Convert file to html
                    cy.readFile('cypress/downloads/searchResults.docx').then(()=>{
                         cy.exec('npm run searchResults-convert', {failOnNonZeroExit: false})
                         cy.validateFile({
                             type:'html',
                             resNum:12,
                             collection:'תנ"ך'
                         })
                     })
                })
            })
        
            it('Word download do not include the שמות קדושים', { browser: '!firefox' },()=>{
                cy.searchRun({text:'א-להים',collection:'תנ"ך',language:'Hebrew'})
                cy.theFormOfTheText('עם ניקוד')
                cy.removeDownloadsFiles()
                cy.downloadFile({type:'Word',shemotKdoshim:true}).then(()=>{
                    //Convert file to html
                    cy.readFile('cypress/downloads/searchResults.docx').then(()=>{
                        cy.exec('npm run searchResults-convert', {failOnNonZeroExit: false})
                        cy.fileDoesNotContain({type:'html',text:'אֱלֹהִים'})
                    })
                })
            })

    
    
        
        })  
     })
})
        



    

    