import React, { useContext, useRef, useEffect, useState } from "react";
import {
    Button,
    Form,
    Input,
    Select
} from "antd";
import FormItem from "antd/es/form/FormItem";
import { GlobalContext } from "../context/GlobalContext";
import './FormEncuestaHacienda.css';

function FormEncuestaHacienda({ editarEncHac }) { //Si queremos crear una nueva Enc la prop editarEncHac va a venir con 0, si queremos editar, viene con los valores de al fila a editar.

    const URL = process.env.REACT_APP_URL;
    const formRef = useRef(null);
    const idUserLogged = localStorage.getItem("usuario");


    const { setDrawerNuevaEnc, actualizarTableData, setActualizarTableData, setDrawerEditarEnc } =
        useContext(GlobalContext);

    const [dataClientes, setDataClientes] = useState([]);

    //Busca y carga el select de clientes en el formulario 'Nueva encuesta'
    useEffect(() => {
        const dataForm = new FormData();
        dataForm.append("idU", idUserLogged);

        const requestOptions = {
            method: 'POST',
            body: dataForm
        };

        const fetchDataClientesxUser = async () => {
            const data = await fetch(`${URL}selectClientesxUser.php`, requestOptions);
            const jsonData = await data.json();
            setDataClientes(jsonData);
        }

        fetchDataClientesxUser()
            .catch(console.error);;

        if (editarEncHac) {
            formRef.current.setFieldsValue({
                tambosPro: editarEncHac?.tambos,
                tambosCab: editarEncHac?.vacasordeñe,
                litros: editarEncHac?.litros,
                feedlot: editarEncHac?.feedlot,
                invernador: editarEncHac?.invernador,
                cria: editarEncHac?.cria,
                consestusd: editarEncHac?.consestusd,
            });
        }
    }, [])


    const optionsCliente = dataClientes.map((cliente) => ({
        value: cliente.cli_id,
        label: cliente.cli_nombre,
    }));

    //Funcion que crea una NUEVA encuenta de hacienda
    async function crearEncuesta(values) {
        console.log('Intentando guardar')
        const data = new FormData();
        data.append("idC", values.idCliente);
        data.append("tambosPro", values.tambosPro ? values.tambosPro : 0);
        data.append("tambosCab", values.tambosCab ? values.tambosCab : 0);
        data.append("litros", values.litros ? values.litros : 0);
        data.append("feedlot", values.feedlot ? values.feedlot : 0);
        data.append("invernador", values.invernador ? values.invernador : 0);
        data.append("cria", values.cria ? values.cria : 0);
        data.append("consumoE", values.consestusd ? values.consestusd : 0);

        const requestOptions = {
            method: 'POST',
            body: data
        };
        const response = await fetch(`${URL}clientView_nuevaEncHac.php?usuid=${idUserLogged}`, requestOptions);
        console.log(response);
        setDrawerNuevaEnc(false);
        setActualizarTableData(!actualizarTableData);
    }

    //Funcion que MODIFICA una encuenta de hacienda
    async function editarEncuesta(values) {
        console.log('Tratando de editar')
        const data = new FormData();
        //data.append("idC", values.idCliente);
        data.append("idCabh", Number(editarEncHac.key));
        data.append("tambosPro", values.tambosPro);
        data.append("tambosCab", values.tambosCab);
        data.append("litros", values.litros);
        data.append("feedlot", values.feedlot);
        data.append("invernador", values.invernador);
        data.append("cria", values.cria);
        data.append("consumoE", values.consestusd)

        const requestOptions = {
            method: 'POST',
            body: data
        };
        const response = await fetch(`${URL}clientView_editarEncHac.php`, requestOptions);
        console.log(response);

        setDrawerEditarEnc(false);
        setActualizarTableData(!actualizarTableData);
    }



    return (
        <>
            <Form
                layout="vertical"
                ref={formRef}
                onFinish={editarEncHac ? editarEncuesta : crearEncuesta}
                autoComplete="off"
            >
                <div className="contenedor-inputs">
                    {!editarEncHac ? <FormItem style={{ width: '250px' }} name="idCliente" className="formItem-style" label="Cliente"
                        hasFeedback
                        rules={[{
                            required: true,
                            message: "Seleccione un cliente"
                        }]}>
                        <Select
                            showSearch
                            className='input-style'
                            placeholder="Selecciona un cliente"
                            optionFilterProp="children"
                            filterOption={(input, option) => (option?.label ?? '').includes(input)}
                            options={optionsCliente}
                        />
                    </FormItem> : ''}
                    <FormItem name="tambosPro" className="formItem-style" label="Cantidad Tambos" hasFeedback
                        rules={[{
                            required: false,
                            message: "Ingrese solo números",
                            pattern: new RegExp('^[0-9]+$')
                        }]}>
                        <Input name="tambosPro" className='input-style' placeholder='0' />
                    </FormItem>

                    <FormItem name="litros" className="formItem-style" label="Producción Litro/Día"
                        hasFeedback
                        rules={[{
                            required: false,
                            message: "Ingrese solo números",
                            pattern: new RegExp('^[0-9]+$')
                        }]}>
                        <Input name="litros" className='input-style' placeholder='0' />
                    </FormItem>

                    <FormItem name="tambosCab" className="formItem-style" label="Cantidad Vacas en ordeñe"
                        hasFeedback
                        rules={[{
                            required: false,
                            message: "Ingrese solo números",
                            pattern: new RegExp('^[0-9]+$')
                        }]}>
                        <Input name="tambosCab" className='input-style' placeholder='0' />
                    </FormItem>

                    <FormItem name="feedlot" className="formItem-style" label="Produccion Anual FeedLot"
                        hasFeedback
                        rules={[{
                            required: false,
                            message: "Ingrese solo números",
                            pattern: new RegExp('^[0-9]+$')
                        }]}>
                        <Input name="feedlot" className='input-style' placeholder='0' />
                    </FormItem>

                    <FormItem name="invernador" className="formItem-style" label="Produccion Anual Invernador"
                        hasFeedback
                        rules={[{
                            required: false,
                            message: "Ingrese solo números",
                            pattern: new RegExp('^[0-9]+$')
                        }]}>
                        <Input name="invernador" className='input-style' placeholder='0' />
                    </FormItem>

                    <FormItem name="cria" className="formItem-style" label="Produccion Anual Cria"
                        hasFeedback
                        rules={[{
                            required: false,
                            message: "Ingrese solo números",
                            pattern: new RegExp('^[0-9]+$')
                        }]}>
                        <Input name="cria" className='input-style' placeholder='0' />
                    </FormItem>

                    <FormItem name="consestusd" className="formItem-style" label="Consumo Estimado U$D"
                        hasFeedback
                        rules={[{
                            required: false,
                            message: "Ingrese solo números",
                            pattern: new RegExp('^[0-9]+$')
                        }]}>
                        <Input name="consestusd" className='input-style' placeholder='0' />
                    </FormItem>
                </div>

                <Button
                    type="primary"
                    htmlType="submit"
                    className='btn-guardar'
                >GUARDAR</Button>

            </Form>
        </>
    )
}

export default FormEncuestaHacienda