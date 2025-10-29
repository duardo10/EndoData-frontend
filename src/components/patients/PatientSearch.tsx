"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Calendar, IdCard, Loader2 } from "lucide-react";
import styles from './PatientSearch.module.css'
import { PatientService, Patient } from '@/services/patientService'

// Interface para o resultado da busca com paginação
interface SearchResult {
  patients: Patient[];
  total: number;
  page: number;
  limit: number;
}

export function PatientSearch(): React.ReactElement {
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalPatients, setTotalPatients] = useState(0);
  const itemsPerPage = 6;

  // Função para formatar CPF
  const formatCpf = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  // Função para formatar data
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  // Função para gerar avatar baseado no nome
  const generateAvatar = (name: string) => {
    const initials = name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
    
    // Gerar cor baseada no nome
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500',
      'bg-red-500', 'bg-yellow-500', 'bg-indigo-500', 'bg-teal-500'
    ];
    const colorIndex = name.length % colors.length;
    
    return (
      <div className={`w-12 h-12 rounded-full ${colors[colorIndex]} flex items-center justify-center text-white font-semibold`}>
        {initials}
      </div>
    );
  };

  // Buscar pacientes
  const searchPatients = async (searchText: string = '', page: number = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      let result: SearchResult;
      
      if (searchText.trim()) {
        // Busca por texto (nome ou CPF)
        result = await PatientService.searchPatients(searchText.trim(), itemsPerPage);
      } else {
        // Busca todos os pacientes
        const response = await PatientService.getPatients();
        result = {
          patients: response.patients,
          total: response.total,
          page: response.page,
          limit: response.limit
        };
      }
      
      setPatients(result.patients);
      setTotalPatients(result.total);
      setTotalPages(Math.ceil(result.total / itemsPerPage));
      
      // Mostrar feedback visual para busca por CPF
      const isNumericSearch = /^\d+$/.test(searchText.replace(/\D/g, ''))
      const cleanSearch = searchText.replace(/\D/g, '')
      if (isNumericSearch && cleanSearch.length >= 3) {
        console.log(`🔍 Buscando por CPF: ${cleanSearch}`)
      }
      
    } catch (err: any) {
      console.error('Erro ao buscar pacientes:', err);
      setError(err?.message || 'Erro ao carregar pacientes');
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  // Carregar pacientes iniciais
  useEffect(() => {
    searchPatients();
  }, []);

  // Buscar quando a query mudar (com debounce otimizado para CPF)
  useEffect(() => {
    const isNumericInput = /^\d+$/.test(query.replace(/\D/g, ''))
    const cleanInput = query.replace(/\D/g, '')
    
    // Debounce menor para CPF (150ms) e maior para nome (300ms)
    const debounceTime = isNumericInput && cleanInput.length >= 3 ? 150 : 300
    
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        searchPatients(query.trim(), 1);
        setCurrentPage(1);
      } else {
        searchPatients('', 1);
        setCurrentPage(1);
      }
    }, debounceTime);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Sugestões para autocomplete (limite de 5)
  const suggestions = useMemo(() => {
    if (!query.trim() || loading) return [];
    return patients.slice(0, 5);
  }, [patients, query, loading]);

  // Paginação
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      searchPatients(query.trim(), page);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        Busca e Listagem de Pacientes
      </h1>

      <div className={styles.inputWrapper}>
        <div className="relative">
          <input
            aria-label="Buscar pacientes"
            className={styles.input}
            placeholder="Buscar por nome ou CPF (digite apenas números para CPF)..."
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
          {loading ? (
            <Loader2 className={styles.icon} size={20} />
          ) : (
            <svg
              className={styles.icon}
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
          )}
          {/* Sugestões dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className={styles.suggestions}>
              <ul className={styles.suggestionsList}>
                {suggestions.map((patient) => (
                  <li key={patient.id} className={styles.suggestionItem}>
                    <Link
                      href={`/dashboard/pacientes/${patient.id}`}
                      className={styles.suggestionLink}
                      onClick={() => {
                        setQuery(patient.name);
                        setShowSuggestions(false);
                      }}
                    >
                      {generateAvatar(patient.name)}
                      <div>
                        <div className="text-sm font-medium text-sky-700">{patient.name}</div>
                        <div className="text-xs text-gray-500">CPF: {formatCpf(patient.cpf)}</div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Estados de loading e erro */}
      {loading && patients.length === 0 && (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="animate-spin" size={32} />
          <span className="ml-2">Carregando pacientes...</span>
        </div>
      )}

      {error && (
        <div className="text-center py-10 text-red-500">
          <h2 className="text-xl font-bold mb-2">Erro</h2>
          <p>{error}</p>
          <button 
            onClick={() => searchPatients(query.trim(), currentPage)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {/* Grid de pacientes */}
      {!loading && !error && (
        <div className={styles.grid}>
          {patients.map((patient) => (
            <Link
              key={patient.id}
              href={`/dashboard/pacientes/${patient.id}`}
              className="block"
            >
              <div className={styles.card}>
                {generateAvatar(patient.name)}
                <div>
                  <div className={styles.cardName}>{patient.name}</div>
                  <div className={styles.cardMeta}>
                    <IdCard size={14} /> <span>CPF: {formatCpf(patient.cpf)}</span>
                  </div>
                  {patient.birthDate && (
                    <div className={styles.cardMeta}>
                      <Calendar size={14} /> <span>Nascimento: {formatDate(patient.birthDate)}</span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Estado vazio */}
      {!loading && !error && patients.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          <h2 className="text-3xl font-bold mb-2">Nenhum paciente encontrado</h2>
          <p className="mb-2">Não há pacientes cadastrados ou que correspondam à sua busca.</p>
          <p>Cadastre um novo paciente para começar.</p>
        </div>
      )}

      {/* Paginação */}
      {!loading && !error && totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className={styles.pageBtn}
          >
            &lt; Anterior
          </button>

          <div className={styles.pageNumbersWrapper}>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                disabled={loading}
                className={`${styles.pageNumber} ${
                  currentPage === i + 1
                    ? styles.pageNumberActive
                    : i + 1 === currentPage + 1
                    ? styles.pageNumberNext
                    : styles.pageNumberInactive
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
            className={styles.pageBtn}
          >
            Próximo &gt;
          </button>
        </div>
      )}

      {/* Informações de paginação */}
      {!loading && !error && patients.length > 0 && (
        <div className="text-center text-sm text-gray-500 mt-4">
          Mostrando {patients.length} de {totalPatients} pacientes
        </div>
      )}
    </div>
  );
}
