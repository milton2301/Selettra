import React, { useState, useRef, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import axios from 'axios';    

    const BarChart = () => {

        const Api = axios.create({baseURL: 'http://localhost:8081/'});
    const load = useRef(null)

    useEffect(() => {
        fetchAll()
    })

    let dados = []
    let mes = []
    const fetchAll = () => {
        load.current = true;
        async function fetchAll() {
            const result = await Api.get("candidaturas")
            if (result.data) {
                dados = result.data
                Array.from(dados).forEach(val => {
                    let data = new Date(val.dtcad)
                    let month = data.toLocaleString('default', { month: 'long' });
                    if (!mes.includes(month)) {
                        mes.push(month)
                    }
                })             
            }
        }
        if (load.current) {
            fetchAll();
        }
        load.current = false;
    }


    
    
        const [stackedData] = useState({
            labels: mes,
            datasets: [{
                type: 'bar',
                label: 'Vagas Abertas',
                backgroundColor: '#42A5F5',
                data: [
                    50,
                    25,
                    12,
                    48,
                    90,
                    76,
                    42
                ]
            }, {
                type: 'bar',
                label: 'Vagas Preenchidas',
                backgroundColor: '#66BB6A',
                data: [
                    21,
                    84,
                    24,
                    75,
                    37,
                    65,
                    34
                ]
            }]
        });
    
        const getLightTheme = () => {
            let basicOptions = {
                maintainAspectRatio: false,
                aspectRatio: .8,
                plugins: {
                    legend: {
                        labels: {
                            color: '#495057'
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: '#495057'
                        },
                        grid: {
                            color: '#ebedef'
                        }
                    },
                    y: {
                        ticks: {
                            color: '#495057'
                        },
                        grid: {
                            color: '#ebedef'
                        }
                    }
                }
            };
    
            let horizontalOptions = {
                indexAxis: 'y',
                maintainAspectRatio: false,
                aspectRatio: .8,
                plugins: {
                    legend: {
                        labels: {
                            color: '#495057'
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: '#495057'
                        },
                        grid: {
                            color: '#ebedef'
                        }
                    },
                    y: {
                        ticks: {
                            color: '#495057'
                        },
                        grid: {
                            color: '#ebedef'
                        }
                    }
                }
            };
    
            let stackedOptions = {
                maintainAspectRatio: false,
                aspectRatio: .8,
                plugins: {
                    tooltips: {
                        mode: 'index',
                        intersect: false
                    },
                    legend: {
                        labels: {
                            color: '#495057'
                        }
                    }
                },
                scales: {
                    x: {
                        stacked: true,
                        ticks: {
                            color: '#495057'
                        },
                        grid: {
                            color: '#ebedef'
                        }
                    },
                    y: {
                        stacked: true,
                        ticks: {
                            color: '#495057'
                        },
                        grid: {
                            color: '#ebedef'
                        }
                    }
                }
            };
    
            let multiAxisOptions = {
                maintainAspectRatio: false,
                aspectRatio: .8,
                plugins: {
                    legend: {
                        labels: {
                            color: '#495057'
                        }
                    },
                    tooltips: {
                        mode: 'index',
                        intersect: true
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: '#495057'
                        },
                        grid: {
                            color: '#ebedef'
                        }
                    },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        ticks: {
                            min: 0,
                            max: 100,
                            color: '#495057'
                        },
                        grid: {
                            color: '#ebedef'
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        grid: {
                            drawOnChartArea: false,
                            color: '#ebedef'
                        },
                        ticks: {
                            min: 0,
                            max: 100,
                            color: '#495057'
                        }
                    }
                }
            };
    
            return {
                basicOptions,
                horizontalOptions,
                stackedOptions,
                multiAxisOptions
            }
        }
    
        const { stackedOptions } = getLightTheme();
    
        return (
            <div>
                <div className="card">
                    <h5>Stacked</h5>
                    <Chart type="bar" data={stackedData} options={stackedOptions} />
                </div>
            </div>
        )
    }                
                 
export default function Home() {
    return <div className="card">
        <div className="grid">
            <div className="col-12">
            < BarChart />
            </div>
        </div>
       </div>
}