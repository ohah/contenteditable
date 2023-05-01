export interface OfficeResponse {
  rank: number;
  national_power: number;
  money: number;
  energy: number;
  person: number;
  income: Income;
  turn: Turn;
  planet: Planet;
  mineral: Mineral;
}

export interface Income {
  rank: 5;
  money: number;
  energy: number;
  person: number;
  Li: number;
  Cs: number;
  Be: number;
  Fe: number;
  dark_matter: number;
  anti_matter: number;
}
export interface Mineral {
  Li: number;
  Cs: number;
  Be: number;
  Fe: number;
  dark_matter: number;
  anti_matter: number;
}

export interface Planet {
  desert: number;
  aqua: number;
  gas: number;
  star: number;
  toxic: number;
  total: number;
}

export interface Turn {
  now: number;
  total: number;
}

const office: OfficeResponse = {
  rank: 1,
  national_power: 1561890489,
  money: 15006597808,
  energy: 18984089,
  person: 131314,
  income: {
    rank: 5,
    money: 1000,
    person: 100,
    energy: -4000,
    Li: 131414,
    Cs: 1341414,
    Be: 2342134,
    Fe: 124141,
    dark_matter: 1,
    anti_matter: 3,
  },
  turn: {
    now: 250,
    total: 9524,
  },
  planet: {
    desert: 5,
    aqua: 3,
    gas: 4,
    star: 1,
    toxic: 1,
    total: 14,
  },
  mineral: {
    Li: 131414,
    Cs: 1341414,
    Be: 2342134,
    Fe: 124141,
    dark_matter: 1,
    anti_matter: 3,
  },
};

export default office;
