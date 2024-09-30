import conjugador from "conjugador"
import plural from "pluralize-ptbr"

export function getVariations(word:string){
    try{
        const doc = conjugador(word);

        const conjugations:string[] = Object.values(doc).flatMap((conjugation) => {
            return conjugation;
        })  
        return conjugations;
    }
    catch{
        const pluralWord = plural(word);
        if(pluralWord !== word){
            return [word, pluralWord];
        }

        return [word];
    }

}