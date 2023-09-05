import React, { useContext, useEffect, useState } from "react";
import {
    Button,
    Drawer,
    Table,
    Modal,
    Divider,
    Row,
    Col,
    Input,
    Space
} from "antd";
import {
    EditOutlined,
    EyeOutlined,
    CloseOutlined,
    SearchOutlined
} from "@ant-design/icons";
import moment from 'moment';
import "./TablaEncuestaHacienda.css";
import { GlobalContext } from "../context/GlobalContext";
import FormEncuestaHacienda from "./FormEncuestaHacienda";

function TablaEncuestaHacienda() {

    const URL = process.env.REACT_APP_URL;

    const { drawerNuevaEnc, setDrawerNuevaEnc, drawerEditarEnc, setDrawerEditarEnc, actualizarTableData } = useContext(GlobalContext);

    const [dataHacienda, setDataHacienda] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [encuesta, setEncuesta] = useState(0);
    const [open, setOpen] = useState(false);

    useEffect(() => {

        const fetchDataEncHac = async () => {
            const data = await fetch(`${URL}clientView_traerEncHaciendaAll.php`);
            const jsonData = await data.json();
            setDataHacienda(jsonData);
        }

        fetchDataEncHac()
            .catch(console.error);;



    }, [actualizarTableData]);

    useEffect(() => {
        fechasMaxPorCliente();
    }, [dataHacienda]);

    //Cambia formato de numeros con miles a puntos Ej: 1000 -> 1.000
    const milesFormat = (number) => {
        return Number(number)?.toLocaleString('de-DE');
    }

    //Columnas Ant Design 
    const columns = [
        {
            title: "FECHA",
            dataIndex: "fecha",
            key: "fecha",
            align: "center",
            sorter: {
                compare: (a, b) =>
                    moment(a.fecha, "DD-MM-YYYY") - moment(b.fecha, "DD-MM-YYYY"),
            },
        },
        {
            title: "CLIENTE",
            dataIndex: "cliente",
            key: "cliente",
            align: "left",
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
                return (
                    <div style={{ padding: '8px' }}>
                        <Input
                            className="input-buscador"
                            autoFocus
                            placeholder="Buscar..."
                            value={selectedKeys[0]}
                            onChange={(e) => {
                                setSelectedKeys(e.target.value ? [e.target.value] : [])
                            }}
                            onPressEnter={() => {
                                confirm();
                            }}
                            onBlur={() => {
                                confirm();
                            }}
                        >

                        </Input>
                        <Space>
                            <Button className="btn-buscador" size="small"
                                onClick={() => {
                                    confirm();
                                }}
                                type="primary"><SearchOutlined />Buscar</Button>

                            <Button className="btn-reset" size="small"
                                onClick={() => {
                                    clearFilters({ confirm: true, closeDropdown: true })
                                }}
                                type="default">Reiniciar</Button>
                        </Space>
                    </div>
                );
            },
            filterIcon: () => {
                return <SearchOutlined className="search-icon" />;
            },
            onFilter: (value, record) => {
                return record.cliente.toLowerCase().trim().includes(value.toLowerCase().trim())
            },
            // sorter: {
            //     compare: (a, b) => a.cliente.localeCompare(b.cliente),
            // },
        },
        {
            title: "TAMBOS",
            dataIndex: "tambos",
            key: "tambos",
            align: "end",
            sorter: {
                compare: (a, b) => a.tambos - b.tambos,
            },
        },
        {
            title: "LITROS",
            dataIndex: "litros",
            key: "litros",
            align: "end",
            sorter: {
                compare: (a, b) => a.litros - b.litros,
            },
        },
        {
            title: "VACAS ORDEÑE",
            dataIndex: "vacasordeñe",
            key: "vacasordeñe",
            align: "end",
            sorter: {
                compare: (a, b) => a.vacasordeñe - b.vacasordeñe,
            },
        },
        {
            title: "FEEDLOT",
            dataIndex: "feedlot",
            key: "feedlot",
            align: "end",
            sorter: {
                compare: (a, b) => a.feedlot - b.feedlot,
            },
        },
        {
            title: "INVERNADOR",
            dataIndex: "invernador",
            key: "invernador",
            align: "end",
            sorter: {
                compare: (a, b) => a.invernador - b.invernador,
            },
        },
        {
            title: "CRIA",
            dataIndex: "cria",
            key: "cria",
            align: "end",
            sorter: {
                compare: (a, b) => a.cria - b.cria,
            },
        },
        {
            title: "CONS. EST. U$S",
            dataIndex: "consestusd",
            key: "consestusd",
            align: "end",
            sorter: {
                compare: (a, b) => a.consestusd - b.consestusd,
            },
        },
        {
            title: "CONS. REAL U$S",
            dataIndex: "consrealusd",
            key: "consrealusd",
            align: "end",
            sorter: {
                compare: (a, b) => a.consrealusd - b.consrealusd,
            },
        },
        {
            title: "...",
            key: "acciones",
            align: "center",
            render: (fila) => {
                return (
                    <>
                        {fila.isMasReciente ?
                            <div className="btn-contenedor">
                                <EyeOutlined className="icon-color" onClick={() => seleccionarEnc(fila, 'verDetalle')} />
                                <EditOutlined className="icon-color" onClick={() => seleccionarEnc(fila, 'editar')} />
                            </div>
                            : <div className="btn-contenedor">
                                <EyeOutlined className={fila.isMasReciente ? "icon-color" : "icon-color align-eye"} onClick={() => seleccionarEnc(fila, 'verDetalle')} />
                            </div>}
                    </>
                );
            },
        }
    ];

    const CustomCloseIcon = () => (
        <div className="drawer-close-icon">
            <CloseOutlined />
        </div>
    );

    //Asigna el valor de la fila al presionar editar
    const seleccionarEnc = (fila, accion) => {
        setEncuesta(fila);
        if (accion === 'editar') setDrawerEditarEnc(true);
        if (accion === 'verDetalle') setOpen(true);
    }


    const dataHac = dataHacienda.map((Enc, index) => ({
        key: Enc.cabh_id,
        index: index,
        fecha: Enc.fecha,
        cliente: Enc.cli_nombre,
        idCliente: Enc.cli_id,
        tambos: milesFormat(Enc.cant_tambosprod),
        vacasordeñe: milesFormat(Enc.cant_tamboscab),
        feedlot: milesFormat(Enc.cant_feedlot),
        invernador: milesFormat(Enc.cant_invernador),
        cria: milesFormat(Enc.cant_cria),
        consestusd: milesFormat(Enc.cabh_consumoestimado),
        litros: milesFormat(Enc.cabh_litros),
        isMasReciente: false,
        consrealusd: '',
    }));


    async function fechasMaxPorCliente() {

        //Agrupamos la dataHac por cliente
        const agruparDataHacPorCliente = dataHac.reduce((group, arr) => {
            const { cliente } = arr;
            group[cliente] = group[cliente] ?? [];
            group[cliente].push(arr);
            return group;
        },
            {});

        //Por cada grupo de clientes, identifica cual es el mas reciente de acuerdo a la fecha, luego
        //asigna el valor true a la clave 'isMasReciente'.
        for (const variable in agruparDataHacPorCliente) {

            let fechaMax = moment("01-01-1800", "DD-MM-YYYY");
            let idFechaMax = 0;
            agruparDataHacPorCliente[variable].forEach(element => {
                if (moment(fechaMax, "DD-MM-YYYY") < moment(element.fecha, "DD-MM-YYYY")) {
                    fechaMax = moment(element.fecha, "DD-MM-YYYY");
                    idFechaMax = element.key;
                }
            });

            for (const element of dataHac) {
                if (element.key === idFechaMax) {
                    element.isMasReciente = true;
                    element.consrealusd = await fetchConsumoRealUSD(element.idCliente);
                }
            }
        }

        setTableData(dataHac);
    }

    async function fetchConsumoRealUSD(idC) {
        const dataForm = new FormData();
        dataForm.append("idC", idC);

        const requestOptions = {
            method: 'POST',
            body: dataForm
        };

        const fetchDataConsRealxCliente = async () => {
            const data = await fetch(`${URL}clientView_traerRealConsumoHacienda.php`, requestOptions);
            const jsonData = await data.json();
            return jsonData;
        }
        const consrealusd = await fetchDataConsRealxCliente();

        return consrealusd[0] ? milesFormat(consrealusd[0].costo_real) : ''
    }


    return (
        <>
            <div className="div-boton">
                <h3 className="titulo-modulo">ENCUESTA DE HACIENDA</h3>
                <Button type="primary" className="btn-flat" onClick={() => setDrawerNuevaEnc(true)}>NUEVA ENCUESTA</Button>
            </div>


            <Table
                size={"small"}
                dataSource={tableData}
                columns={columns}
                pagination={{
                    position: ["none", "bottomRight"]
                }}
            />

            <Drawer
                title="Nueva encuesta hacienda"
                open={drawerNuevaEnc}
                onClose={() => setDrawerNuevaEnc(false)}
                width={320}
                closeIcon={<CustomCloseIcon />}
                destroyOnClose={true}
            >
                <FormEncuestaHacienda />
            </Drawer>

            <Drawer
                title="Editar encuesta hacienda"
                open={drawerEditarEnc}
                onClose={() => setDrawerEditarEnc(false)}
                width={320}
                closeIcon={<CustomCloseIcon />}
                destroyOnClose={true}
            >
                <FormEncuestaHacienda editarEncHac={encuesta} />
            </Drawer>

            {/*Seccion de modal Detalles, se abre al presionar el boton con icono de ojo*/}
            <Modal
                title={
                    <div className="contenedor-total-descripcion">
                        <div className="cliente-modal">{encuesta.cliente}</div>{'-'}
                        <div className="titulo-modal">FECHA ENCUESTA: {encuesta.fecha}</div>
                    </div>
                }
                centered
                open={open}
                onOk={() => setOpen(false)}
                onCancel={() => setOpen(false)}
                width={800}
                footer={[
                    <Button
                        key="btnAceptarModal"
                        type="primary"
                        onClick={() => setOpen(false)}
                        className="btn-flat"
                    >
                        Aceptar
                    </Button>,
                ]}
            >
                <Divider className="divider-style" />

                <div className="body-modal">
                    <Row className="card-row">
                        <Col xs={24} sm={12} md={6} className="div-secundario">
                            <p className="total">
                                {encuesta.tambos}
                            </p>
                            <p className="descripcion">TAMBOS</p>
                        </Col>

                        <Col xs={24} sm={12} md={6} >
                            <div className="div-secundario">
                                <p className="total">{encuesta.vacasordeñe}</p>
                                <p className="descripcion">VACAS ORDEÑE</p>
                            </div>
                            <Divider style={{ marginTop: "10px", marginBottom: "10px" }} />
                            <div className="div-secundario">
                                <p className="total">{encuesta.litros}</p>
                                <p className="descripcion">LITROS</p>
                            </div>
                        </Col>

                        <Col xs={24} sm={12} md={6} className="div-secundario">
                            <p className="total">{encuesta.feedlot}</p>
                            <p className="descripcion">FEEDLOT</p>
                        </Col>
                    </Row>
                    <Divider className="divider-style" />
                    <Row className="card-row">

                        <Col xs={24} sm={12} md={6} className="div-secundario">
                            <p className="total">{encuesta.invernador}</p>
                            <p className="descripcion">INVERNADOR</p>
                        </Col>

                        <Col xs={24} sm={12} md={6} >
                            <div className="div-secundario">
                                <p className="total">{encuesta.consestusd}</p>
                                <p className="descripcion">CONSUMO ESTIMADO U$S</p>
                            </div>
                            <Divider style={{ marginTop: "10px", marginBottom: "10px" }} />
                            <div className="div-secundario">
                                <div className="contenedor-total-descripcion">
                                    <p className="total">{encuesta.consrealusd}</p>
                                    {encuesta.consrealusd && encuesta.consestusd > 0 ? <p className="descripcion-porcentual">({Math.trunc((encuesta.consrealusd * 100) / encuesta.consestusd)}%)</p>
                                        : (encuesta.consrealusd && encuesta.consestusd === 0 ? <p className="descripcion-porcentual"></p> : <p className="descripcion-porcentual">-</p>)}
                                </div>
                                <p className="descripcion">CONSUMO REAL U$S</p>
                            </div>
                        </Col>
                        <Col xs={24} sm={12} md={6} className="div-secundario">
                            <p className="total">{encuesta.cria}</p>
                            <p className="descripcion">CRIA</p>
                        </Col>

                    </Row>
                </div>
            </Modal>

        </>
    )
}

export default TablaEncuestaHacienda

