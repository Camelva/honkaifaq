import { readFileSync, writeFileSync } from "fs";
import { parse } from 'yaml'

function template() {
    return `<!-- Code generated by 'npm run prebuild'. DO NOT EDIT. -->

# Compiled list of FAQ's from Honkai Impact 3rd Official discord server

[[toc]]

`
}

function parseIndex(fileName) {
    let index = parse(readFileSync(fileName, {encoding:"utf-8"}))

    return index
}

function processCategory(category, baseURL) {
    let result = ""

    if (category === null) {
        result += `\tNone\n`
        return result
    }

    category.forEach(el => {
        for (const [key, value] of Object.entries(el)) {
            // console.log(`${key}: ${value}`);
            result += `- [${value}](${baseURL + key})\n`
          }
    });
    result += "\n"
    return result
}

function main() {
    let index = parseIndex("categories.yml")

    let result = template()

    for (const catName in index) {
        if (Object.hasOwnProperty.call(index, catName)) {
            let baseURL = "/faq/"

            const category = index[catName];

            if (catName === "Missing") {
                // No need to list them
                continue
            }
            
            result += `## ${catName}\n`

            // 
            if (catName === "Regional") {
                for (const subCatName in category) {
                    if (Object.hasOwnProperty.call(category, subCatName)) {
                        let newBaseURL = baseURL + (regionalPath[subCatName] || "")
                        const subCategory = category[subCatName];
                        result += `### ${subCatName}\n`
                        result += processCategory(subCategory, newBaseURL)
                    }
                }
                continue
            }

            result += processCategory(category, baseURL)
        }
    }    
    writeFileSync("docs/archive.md", result)
}

const regionalPath = {
    "French": "fr/",
    "Spanish": "es/",
    "Indonesian": "id/"
}

main()