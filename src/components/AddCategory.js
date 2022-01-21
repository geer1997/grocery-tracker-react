import React from "react";
import { Form, Input, Button, DatePicker } from "antd";
import "antd/dist/antd.css";
import "./AddItem.scss";

const AddCategory = ({ addCategory, cancelModal }) => {

    const [form] = Form.useForm();

    const onFinish = (values) => {
        addCategory(values)
    };

    return (
        <div>
            <Form form={form} name="control-hooks" onFinish={onFinish}>
                <Form.Item name="name" label="Nombre" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Añadir
                    </Button>
                    <Button htmlType="button" onClick={() => cancelModal()}>
                        Cancelar
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};
export default AddCategory;