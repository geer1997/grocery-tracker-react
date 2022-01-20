import React, { useState } from "react";
import { useFirestore } from "react-redux-firebase";
import { useSelector } from "react-redux";
import { Form, Input, Button, Select, Divider } from "antd";
import "antd/dist/antd.css";

const { Option } = Select;

const AddItem = ({ categories, groceryLists }) => {
  const [presentItem, setPresentItem] = useState("");
  const firestore = useFirestore();
  const currentUser = useSelector((state) => {
    console.log("state", state);
    return state?.currentUser?.user
  });

  
  console.log("uid", currentUser?.uid)
  const uid = currentUser?.uid;

  const handleChange = ({ currentTarget: { name, value } }) => {
    if (name === "addItem") {
      setPresentItem(value);
    }
  };

  const addNewItem = (item, groceryList) => {
    firestore
      .collection("grocery-lists")
      .doc(groceryList)
      .collection('items')
      .add(item)
      .then((docRef) => {
        console.log("result", docRef);
        docRef.update({
          itemID: docRef.id,
        });
      }).catch(err => {
        console.log("error", err)
      });
    setPresentItem("");
  };

  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log(values);
    const groceryList = values.groceryList;
    delete values.groceryList
    addNewItem({
      ...values,
      isDone: false,
      createdBy: uid,
    }, groceryList)
  };

  const onReset = () => {
    form.resetFields();
  };

  const onFill = () => {
    form.setFieldsValue({
      note: 'Hello world!',
      gender: 'male',
    });
  };

  return (
    <div>
      <h1><b>Añadir nuevo item</b></h1>
      <Divider/>
      <Form form={form} name="control-hooks" onFinish={onFinish}>
        <Form.Item name="groceryList" label="Lista" rules={[{ required: true }]}>
          <Select
            placeholder="Selecciona la lista a la que desea agregar este producto"
          >
            {groceryLists && groceryLists.length > 0 && groceryLists.map((groceryList) =>
              <Option value={groceryList.id} key={groceryList.id}>{groceryList.date.toDate().toLocaleString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</Option>
            )}
            {/* <Option value="male">male</Option>
            <Option value="female">female</Option>
            <Option value="other">other</Option> */}
          </Select>
        </Form.Item>
        <Form.Item name="name" label="Nombre" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="category" label="Categoría" rules={[{ required: true }]}>
          <Select
            placeholder="Selecciona la categoría a la que pertenece este producto"
          >
            {categories && categories.length > 0 && categories.map((category) =>
              <Option value={category.id} key={category.id}>{category.name}</Option>
            )}
            {/* <Option value="male">male</Option>
            <Option value="female">female</Option>
            <Option value="other">other</Option> */}
          </Select>
        </Form.Item>
        <Form.Item name="quantity" type="number" label="Cantidad" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button htmlType="button" onClick={onReset}>
            Reset
          </Button>
          <Button type="link" htmlType="button" onClick={onFill}>
            Fill form
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default AddItem;