interface AllPokemonData {
    name: string;
    url: string;
  }
  interface Pokemon {
    name: string;
    id: number;
    types: Array<string>;
    image: string;
  }

export function getIdFromURL(value: string): number {
    let res = value.split("/");
    return parseInt(res[res.length - 2]);
  }
  
export function checkIfEnd(PD: AllPokemonData[], P: Pokemon[]): boolean {
    if (PD.length > 0 && P.length > 0) {
      if (PD[PD.length - 1].name === P[P.length - 1].name) return true;
    }
    return false;
  }

export function capitalizeFirstLetter(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
  
export function insertZeros(value: number): string{
    let l = value.toString().length
    if(l >= 3) return '#' + value.toString()
    if(l === 2) return '#0' + value.toString()
    return '#00' + value
  }

export function filterExcess(d: AllPokemonData){
  return getIdFromURL(d.url) < 10000;
}