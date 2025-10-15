"use client";

import React from "react";
import Link from "next/link";
import { Calendar, IdCard } from "lucide-react";

type Patient = {
  id: string;
  name: string;
  cpf: string;
  birth: string;
  photo: string;
};

const MOCK_PATIENTS: Patient[] = [
  {
    id: "1",
    name: "Bruno Santos",
    cpf: "987.654.321-00",
    birth: "22/07/1985",
    photo: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: "2",
    name: "Carla Oliveira",
    cpf: "456.789.123-00",
    birth: "01/11/1978",
    photo: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    id: "3",
    name: "Elaine Costa",
    cpf: "321.654.987-00",
    birth: "29/09/1972",
    photo: "https://randomuser.me/api/portraits/women/3.jpg",
  },
  {
    id: "4",
    name: "Fábio Rodrigues",
    cpf: "111.222.333-44",
    birth: "05/06/1988",
    photo: "https://randomuser.me/api/portraits/men/4.jpg",
  },
  {
    id: "5",
    name: "Mariana Silva",
    cpf: "222.333.444-55",
    birth: "12/03/1990",
    photo: "https://randomuser.me/api/portraits/women/5.jpg",
  },
  {
    id: "6",
    name: "Lucas Almeida",
    cpf: "333.444.555-66",
    birth: "18/10/1983",
    photo: "https://randomuser.me/api/portraits/men/6.jpg",
  },
  {
    id: "7",
    name: "Renata Carvalho",
    cpf: "444.555.666-77",
    birth: "07/02/1992",
    photo: "https://randomuser.me/api/portraits/women/7.jpg",
  },
  {
    id: "8",
    name: "Diego Fernandes",
    cpf: "555.666.777-88",
    birth: "25/08/1987",
    photo: "https://randomuser.me/api/portraits/men/8.jpg",
  },
  {
    id: "9",
    name: "Patrícia Lima",
    cpf: "666.777.888-99",
    birth: "09/04/1981",
    photo: "https://randomuser.me/api/portraits/women/9.jpg",
  },
  {
    id: "10",
    name: "André Pereira",
    cpf: "777.888.999-00",
    birth: "14/09/1995",
    photo: "https://randomuser.me/api/portraits/men/10.jpg",
  },
  {
    id: "11",
    name: "Camila Souza",
    cpf: "888.999.000-11",
    birth: "23/06/1989",
    photo: "https://randomuser.me/api/portraits/women/11.jpg",
  },
  {
    id: "12",
    name: "Ricardo Barbosa",
    cpf: "999.000.111-22",
    birth: "30/12/1975",
    photo: "https://randomuser.me/api/portraits/men/12.jpg",
  },
  {
    id: "13",
    name: "Fernanda Dias",
    cpf: "123.456.789-10",
    birth: "11/05/1993",
    photo: "https://randomuser.me/api/portraits/women/13.jpg",
  },
  {
    id: "14",
    name: "João Mendes",
    cpf: "234.567.890-11",
    birth: "08/11/1984",
    photo: "https://randomuser.me/api/portraits/men/14.jpg",
  },
  {
    id: "15",
    name: "Isabela Rocha",
    cpf: "345.678.901-22",
    birth: "03/07/1991",
    photo: "https://randomuser.me/api/portraits/women/15.jpg",
  },
];

export function PatientSearch(): React.ReactElement {
  const [query, setQuery] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 6;
  const [showSuggestions, setShowSuggestions] = React.useState(false);

  // Filtra pacientes
  // normaliza (remove acentos e deixa minúsculo)
  const normalize = (s: string) =>
    s
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase()
      .trim();

  const filtered = React.useMemo(() => {
    const q = normalize(query);
    if (!q) return MOCK_PATIENTS;

    // Se a query contém apenas dígitos, comparar com CPF sem formatação por prefixo
    const digitsOnly = q.replace(/\D/g, "");

    return MOCK_PATIENTS.filter((p) => {
      const nameNormalized = normalize(p.name);
      const cpfDigits = p.cpf.replace(/\D/g, "");

      // verificar prefixo do nome ou do cpf
      const nameMatch = nameNormalized.startsWith(q);
      const cpfMatch = digitsOnly ? cpfDigits.startsWith(digitsOnly) : false;

      return nameMatch || cpfMatch;
    });
  }, [query]);

  // Sugestões para autocomplete (limite de 5)
  const suggestions = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return filtered.slice(0, 5);
  }, [filtered, query]);

  // Paginação (lógica original mantida)
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPatients = filtered.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center mb-6 sm:text-3xl text-black">
        Busca e Listagem de Pacientes
      </h1>

      <div className="mb-6 max-w-2xl mx-auto">
        <div className="relative">
          {" "}
          {/* Adiciona um wrapper para o ícone */}
          <input
            aria-label="Buscar pacientes"
            className="w-full border rounded-xl pl-12 pr-4 py-3 shadow-sm 
             bg-white text-black placeholder-gray-400 
             focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Buscar por nome ou CPF..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCurrentPage(1);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          />
          {/* Ícone de busca dentro do input */}
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          {/* Sugestões dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 z-20 mt-2">
              <ul className="bg-white border rounded-md shadow overflow-hidden">
                {suggestions.map((s) => (
                  <li key={s.id} className="hover:bg-sky-50">
                    <Link
                      href={`/dashboard/pacientes/${s.id}`}
                      className="px-4 py-3 flex items-center gap-3"
                      onClick={() => {
                        setQuery(s.name);
                        setShowSuggestions(false);
                      }}
                    >
                      <img
                        src={s.photo}
                        alt={s.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <div className="text-sm font-medium text-sky-700">{s.name}</div>
                        <div className="text-xs text-gray-500">CPF: {s.cpf}</div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentPatients.map((p) => (
          <Link
            key={p.id}
            href={`/dashboard/pacientes/${p.id}`}
            className="block"
          >
            {/* COR DE FUNDO DO CARD ALTERADA AQUI */}
            <div className="flex items-center gap-4 p-5 bg-[#DEE1E6] rounded-xl shadow hover:shadow-md transition h-full">
              <img
                src={p.photo}
                alt={p.name}
                className="w-14 h-14 rounded-full object-cover flex-shrink-0"
              />
              <div>
                {/* Ajuste da cor do nome do paciente */}
                <div className="text-lg font-semibold text-blue-700 hover:underline">
                  {p.name}
                </div>
                {/* Ajuste da cor dos ícones e textos secundários */}
                <div className="text-sm text-gray-600 flex items-center gap-1.5 mt-1">
                  <IdCard size={14} /> <span>CPF: {p.cpf}</span>
                </div>
                <div className="text-sm text-gray-600 flex items-center gap-1.5">
                  <Calendar size={14} /> <span>Nascimento: {p.birth}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          <p>Nenhum paciente encontrado.</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 sm:gap-3 mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            // Ajuste da cor dos botões de navegação
            className="px-3 py-1 text-gray-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            &lt; Anterior
          </button>

          <div className="flex items-center gap-1 sm:gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`w-8 h-8 rounded-md font-semibold transition-colors ${
                  // Ajuste da cor do botão ativo e inativo
                  currentPage === i + 1
                    ? "bg-blue-600 text-white" // Cor do botão ativo
                    : "hover:bg-blue-100 text-gray-600" // Cor do botão inativo e hover
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            // Ajuste da cor dos botões de navegação
            className="px-3 py-1 text-gray-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Próximo &gt;
          </button>
        </div>
      )}
    </div>
  );
}
