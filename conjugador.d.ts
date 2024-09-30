interface Conjugations {
    presente: string[];
    preteritoImperfeito: string[];
    preteritoPerfeito: string[];
    preteritoMaisQuePerfeito: string[];
    futuroDoPresente: string[];
    futuroDoPreterito: string[];
}

declare module 'conjugador' {
    
    const conjugator: (verb: string) => Conjugations;
    
    export default conjugator;
}