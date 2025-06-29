/**
 * Simulador Monte Carlo para Apostas Esportivas
 * Implementação completa em JavaScript puro
 */

class MonteCarloSimulator {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.initializeTheme();
        this.charts = {};
        this.simulationData = null;
    }

    // Inicializar elementos DOM
    initializeElements() {
        this.form = document.getElementById('simulationForm');
        this.loadingIndicator = document.getElementById('loadingIndicator');
        this.resultsSection = document.getElementById('resultsSection');
        this.showTableBtn = document.getElementById('showTableBtn');
        this.tableContainer = document.getElementById('tableContainer');
        this.themeToggle = document.getElementById('themeToggle');
        
        // Form inputs
        this.inputs = {
            stakeInicial: document.getElementById('stakeInicial'),
            qtdApostas: document.getElementById('qtdApostas'),
            numSimulacoes: document.getElementById('numSimulacoes'),
            chancePerda: document.getElementById('chancePerda'),
            lucroMin: document.getElementById('lucroMin'),
            lucroMax: document.getElementById('lucroMax'),
            prejuizoMin: document.getElementById('prejuizoMin'),
            prejuizoMax: document.getElementById('prejuizoMax')
        };

        // Statistics elements
        this.statsElements = {
            minimo: document.getElementById('statMinimo'),
            maximo: document.getElementById('statMaximo'),
            media: document.getElementById('statMedia'),
            mediana: document.getElementById('statMediana'),
            desvio: document.getElementById('statDesvio'),
            acimaMedia: document.getElementById('statAcimaMedia')
        };
    }

    // Bind event listeners
    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        this.showTableBtn.addEventListener('click', () => this.toggleTable());
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        
        // Form validation
        Object.values(this.inputs).forEach(input => {
            input.addEventListener('input', () => this.validateForm());
        });
    }

    // Inicializar tema
    initializeTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme);
    }

    // Toggle tema
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        this.updateThemeIcon(newTheme);
    }

    // Atualizar ícone do tema
    updateThemeIcon(theme) {
        this.themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    }

    // Validação do formulário
    validateForm() {
        const values = this.getFormValues();
        let isValid = true;

        // Validações específicas
        if (values.lucroMin >= values.lucroMax) {
            this.inputs.lucroMax.setCustomValidity('Taxa máxima deve ser maior que a mínima');
            isValid = false;
        } else {
            this.inputs.lucroMax.setCustomValidity('');
        }

        if (values.prejuizoMin >= values.prejuizoMax) {
            this.inputs.prejuizoMax.setCustomValidity('Taxa máxima deve ser maior que a mínima');
            isValid = false;
        } else {
            this.inputs.prejuizoMax.setCustomValidity('');
        }

        return isValid;
    }

    // Obter valores do formulário
    getFormValues() {
        return {
            stakeInicial: parseFloat(this.inputs.stakeInicial.value),
            qtdApostas: parseInt(this.inputs.qtdApostas.value),
            numSimulacoes: parseInt(this.inputs.numSimulacoes.value),
            chancePerda: parseFloat(this.inputs.chancePerda.value) / 100,
            lucroMin: parseFloat(this.inputs.lucroMin.value) / 100,
            lucroMax: parseFloat(this.inputs.lucroMax.value) / 100,
            prejuizoMin: parseFloat(this.inputs.prejuizoMin.value) / 100,
            prejuizoMax: parseFloat(this.inputs.prejuizoMax.value) / 100
        };
    }

    // Handle form submission
    async handleFormSubmit(e) {
        e.preventDefault();
        
        if (!this.validateForm()) {
            alert('Por favor, corrija os erros no formulário');
            return;
        }

        this.showLoading(true);
        
        try {
            // Usar setTimeout para não bloquear a UI
            setTimeout(() => {
                this.runSimulation();
            }, 100);
        } catch (error) {
            console.error('Erro na simulação:', error);
            alert('Erro ao executar simulação. Tente novamente.');
            this.showLoading(false);
        }
    }

    // Mostrar/esconder loading
    showLoading(show) {
        this.loadingIndicator.classList.toggle('hidden', !show);
        this.resultsSection.classList.toggle('hidden', show);
    }

    // Simular uma série de apostas
    simularApostas(params) {
        let capital = params.stakeInicial;
        const historico = [];
        const detalhes = [];

        for (let i = 0; i < params.qtdApostas; i++) {
            const perdeu = Math.random() < params.chancePerda;
            let taxa, valor, resultado;

            if (perdeu) {
                taxa = this.randomBetween(params.prejuizoMin, params.prejuizoMax);
                valor = -(capital * taxa);
                capital += valor;
                resultado = 'Perdeu';
            } else {
                taxa = this.randomBetween(params.lucroMin, params.lucroMax);
                valor = capital * taxa;
                capital += valor;
                resultado = 'Ganhou';
            }

            historico.push(capital);
            detalhes.push({
                aposta: i + 1,
                resultado,
                taxa: taxa * 100,
                valor,
                capitalFinal: capital
            });
        }

        return { historico, detalhes };
    }

    // Gerar número aleatório entre min e max
    randomBetween(min, max) {
        return Math.random() * (max - min) + min;
    }

    // Executar simulação Monte Carlo
    runSimulation() {
        const params = this.getFormValues();
        const historicos = [];
        const resultadosFinais = [];
        let simulacaoDetalhada = null;

        // Executar simulações
        for (let i = 0; i < params.numSimulacoes; i++) {
            const resultado = this.simularApostas(params);
            historicos.push(resultado.historico);
            resultadosFinais.push(resultado.historico[resultado.historico.length - 1]);
            
            // Salvar primeira simulação para tabela detalhada
            if (i === 0) {
                simulacaoDetalhada = resultado.detalhes;
            }
        }

        // Armazenar dados da simulação
        this.simulationData = {
            historicos,
            resultadosFinais,
            simulacaoDetalhada,
            params
        };

        // Calcular e exibir estatísticas
        this.displayStatistics(resultadosFinais);
        
        // Criar gráficos
        this.createCharts(historicos, resultadosFinais);
        
        // Mostrar resultados
        this.showLoading(false);
        
        // Scroll para resultados
        this.resultsSection.scrollIntoView({ behavior: 'smooth' });
    }

    // Calcular e exibir estatísticas
    displayStatistics(resultados) {
        const stats = this.calculateStatistics(resultados);
        
        this.statsElements.minimo.textContent = this.formatCurrency(stats.minimo);
        this.statsElements.maximo.textContent = this.formatCurrency(stats.maximo);
        this.statsElements.media.textContent = this.formatCurrency(stats.media);
        this.statsElements.mediana.textContent = this.formatCurrency(stats.mediana);
        this.statsElements.desvio.textContent = this.formatCurrency(stats.desvio);
        this.statsElements.acimaMedia.textContent = `${stats.acimaMedia} (${stats.percentualAcimaMedia.toFixed(1)}%)`;
    }

    // Calcular estatísticas
    calculateStatistics(resultados) {
        const sorted = [...resultados].sort((a, b) => a - b);
        const n = resultados.length;
        
        const minimo = Math.min(...resultados);
        const maximo = Math.max(...resultados);
        const media = resultados.reduce((sum, val) => sum + val, 0) / n;
        
        // Mediana
        const mediana = n % 2 === 0 
            ? (sorted[n/2 - 1] + sorted[n/2]) / 2 
            : sorted[Math.floor(n/2)];
        
        // Desvio padrão
        const variancia = resultados.reduce((sum, val) => sum + Math.pow(val - media, 2), 0) / n;
        const desvio = Math.sqrt(variancia);
        
        // Acima da média
        const acimaMedia = resultados.filter(val => val > media).length;
        const percentualAcimaMedia = (acimaMedia / n) * 100;
        
        return {
            minimo,
            maximo,
            media,
            mediana,
            desvio,
            acimaMedia,
            percentualAcimaMedia
        };
    }

    // Formatar valor como moeda
    formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }

    // Criar gráficos
    createCharts(historicos, resultadosFinais) {
        this.createHistogram(resultadosFinais);
        this.createEvolutionChart(historicos);
    }

    // Criar histograma
    createHistogram(resultados) {
        const ctx = document.getElementById('histogramChart').getContext('2d');
        
        // Destruir gráfico anterior se existir
        if (this.charts.histogram) {
            this.charts.histogram.destroy();
        }

        // Calcular bins para o histograma
        const bins = this.calculateBins(resultados, 30);
        
        this.charts.histogram = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: bins.labels,
                datasets: [{
                    label: 'Frequência',
                    data: bins.counts,
                    backgroundColor: 'rgba(59, 130, 246, 0.6)',
                    borderColor: 'rgba(59, 130, 246, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            title: function(context) {
                                const index = context[0].dataIndex;
                                const min = bins.ranges[index].min;
                                const max = bins.ranges[index].max;
                                return `${new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(min)} - ${new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(max)}`;
                            },
                            label: function(context) {
                                return `Simulações: ${context.parsed.y}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Capital Final (R$)'
                        },
                        ticks: {
                            callback: function(value, index) {
                                const range = bins.ranges[index];
                                if (range) {
                                    return new Intl.NumberFormat('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL',
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0
                                    }).format(range.min);
                                }
                                return '';
                            }
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Frequência'
                        },
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Calcular bins para histograma
    calculateBins(data, numBins) {
        const min = Math.min(...data);
        const max = Math.max(...data);
        const binWidth = (max - min) / numBins;
        
        const bins = Array(numBins).fill(0);
        const ranges = [];
        const labels = [];
        
        // Criar ranges e labels
        for (let i = 0; i < numBins; i++) {
            const rangeMin = min + i * binWidth;
            const rangeMax = min + (i + 1) * binWidth;
            ranges.push({ min: rangeMin, max: rangeMax });
            labels.push(`${rangeMin.toFixed(0)}-${rangeMax.toFixed(0)}`);
        }
        
        // Contar valores em cada bin
        data.forEach(value => {
            let binIndex = Math.floor((value - min) / binWidth);
            if (binIndex >= numBins) binIndex = numBins - 1;
            bins[binIndex]++;
        });
        
        return { counts: bins, ranges, labels };
    }

    // Criar gráfico de evolução
    createEvolutionChart(historicos) {
        const ctx = document.getElementById('evolutionChart').getContext('2d');
        
        // Destruir gráfico anterior se existir
        if (this.charts.evolution) {
            this.charts.evolution.destroy();
        }

        // Preparar dados - mostrar apenas algumas linhas para performance
        const maxLines = Math.min(100, historicos.length);
        const step = Math.floor(historicos.length / maxLines);
        const datasets = [];
        
        // Gerar cores variadas
        const colors = this.generateColors(maxLines);
        
        for (let i = 0; i < historicos.length; i += step) {
            if (datasets.length >= maxLines) break;
            
            datasets.push({
                label: `Simulação ${i + 1}`,
                data: historicos[i],
                borderColor: colors[datasets.length],
                backgroundColor: colors[datasets.length],
                borderWidth: 1,
                pointRadius: 0,
                tension: 0.1
            });
        }

        this.charts.evolution = new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array.from({length: historicos[0].length}, (_, i) => i + 1),
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        filter: function(tooltipItem) {
                            return tooltipItem.datasetIndex < 5; // Mostrar apenas 5 linhas no tooltip
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Número da Aposta'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Capital (R$)'
                        },
                        ticks: {
                            callback: function(value) {
                                return new Intl.NumberFormat('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL',
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0
                                }).format(value);
                            }
                        }
                    }
                },
                elements: {
                    line: {
                        borderWidth: 1
                    }
                }
            }
        });
    }

    // Gerar cores variadas para os gráficos
    generateColors(count) {
        const colors = [];
        for (let i = 0; i < count; i++) {
            const hue = (i * 360 / count) % 360;
            const saturation = 70 + (i % 3) * 10;
            const lightness = 45 + (i % 4) * 10;
            colors.push(`hsla(${hue}, ${saturation}%, ${lightness}%, 0.6)`);
        }
        return colors;
    }

    // Toggle tabela detalhada
    toggleTable() {
        const isHidden = this.tableContainer.classList.contains('hidden');
        
        if (isHidden && this.simulationData) {
            this.populateTable(this.simulationData.simulacaoDetalhada);
            this.tableContainer.classList.remove('hidden');
            this.showTableBtn.textContent = '📋 Ocultar Tabela Detalhada';
        } else {
            this.tableContainer.classList.add('hidden');
            this.showTableBtn.textContent = '📋 Mostrar Simulação Individual Detalhada';
        }
    }

    // Popular tabela com dados detalhados
    populateTable(detalhes) {
        const tbody = document.getElementById('tableBody');
        tbody.innerHTML = '';

        detalhes.forEach(detalhe => {
            const row = document.createElement('tr');
            
            const resultClass = detalhe.resultado === 'Ganhou' ? 'result-win' : 'result-loss';
            
            row.innerHTML = `
                <td>${detalhe.aposta}</td>
                <td class="${resultClass}">${detalhe.resultado}</td>
                <td>${detalhe.taxa.toFixed(2)}%</td>
                <td>${this.formatCurrency(detalhe.valor)}</td>
                <td>${this.formatCurrency(detalhe.capitalFinal)}</td>
            `;
            
            tbody.appendChild(row);
        });
    }
}

// Inicializar aplicação quando DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new MonteCarloSimulator();
});

// Adicionar service worker para funcionamento offline (opcional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}