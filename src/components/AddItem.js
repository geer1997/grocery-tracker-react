import React, { useState, useEffect } from "react";
import { useFirestore } from "react-redux-firebase";
import { useSelector } from "react-redux";
import { Form, Input, Button, Select, Divider, Row, Col, Modal, Space } from "antd";
import "antd/dist/antd.css";
import "./AddItem.scss";
import { PlusCircleOutlined } from "@ant-design/icons";
import AddList from "./AddList";
import AddCategory from "./AddCategory";

const { Option } = Select;

const AddItem = ({ categories, groceryLists, itemToEdit }) => {
  const firestore = useFirestore();
  const currentUser = useSelector((state) => {
    console.log("state", state);
    return state?.currentUser?.user
  });

  console.log("uid", currentUser?.uid)
  const uid = currentUser?.uid;

  const [isListModalVisible, setIsListModalVisible] = useState(false);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    console.log("the is an item to edit", Object.entries(itemToEdit).length > 0)
    if (Object.entries(itemToEdit).length > 0) {
      form.setFieldsValue({
        ...itemToEdit
      });
    }
  });

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
    // setPresentItem("");
  };

  const addCategory = (values) => {
    firestore
      .collection("categories")
      .add({
        ...values
      })
      .then((docRef) => {
        console.log("result", docRef);
        setIsCategoryModalVisible(false)
      }).catch(err => {
        console.log("error", err)
      });
    // // setPresentItem("");
  };

  const addList = (values) => {
    values.date = firestore.Timestamp.fromDate(values.date.toDate())
    firestore
      .collection("grocery-lists")
      .add({
        ...values
      })
      .then((docRef) => {
        console.log("result", docRef);
        setIsListModalVisible(false)
      }).catch(err => {
        console.log("error", err)
      });
    // // setPresentItem("");
  };

  const cancelListModal = () => {
    console.log("canceling modal");
    setIsListModalVisible(false)
  }

  const cancelCategoryModal = () => {
    console.log("canceling modal");
    setIsCategoryModalVisible(false)
  }

  const updateItem = (item, groceryList) => {
    const itemToEditId = itemToEdit.id;
    if (groceryList === itemToEdit.groceryList) {
      firestore
        .collection("grocery-lists")
        .doc(groceryList)
        .collection('items')
        .doc(itemToEditId)
        .update(item)
        .then((docRef) => {
          console.log("result", docRef);
          docRef.update({
            itemID: docRef.id,
          });
        }).catch(err => {
          console.log("error", err)
        });
    } else {
      console.log("diferente list id")
      firestore
        .collection("grocery-lists")
        .doc(groceryList)
        .collection('items')
        .add(item)
        .then((docRef) => {
          console.log("result", docRef);
          docRef.update({
            itemID: docRef.id,
          }).then(() => {
            firestore
              .collection("grocery-lists")
              .doc(itemToEdit.groceryList)
              .collection('items')
              .doc(itemToEditId)
              .delete().then(() => console.log('Deleting from before'))
          });

        }).catch(err => {
          console.log("error", err)
        });
    }
    // setPresentItem("");
  };



  const onFinish = (values) => {
    console.log(values);
    const itemAdd = { ...values }
    const groceryList = values.groceryList;
    delete itemAdd.groceryList
    if (itemToEdit) {
      updateItem({
        ...itemAdd
      }, groceryList);
    } else {
      addNewItem({
        ...itemAdd,
        isDone: false,
        createdBy: uid,
      }, groceryList);
    }
  };

  const onReset = () => {
    itemToEdit = null;
    form.resetFields();
  };

  return (
    <div>
      <h1><b>Añadir nuevo item</b></h1>
      <Divider />
      <Form form={form} name="control-hooks" onFinish={onFinish}>
        <Row>
          <Col span={18}>
            <Form.Item name="groceryList" label="Lista" rules={[{ required: true }]}>
              <Select
                placeholder="Selecciona la lista a la que desea agregar este producto"
              >
                {groceryLists && groceryLists.length > 0 && groceryLists.map((groceryList) =>
                  <Option value={groceryList.id} key={groceryList.id}>{groceryList.date.toDate().toLocaleString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</Option>
                )}
              </Select>

            </Form.Item>
          </Col>
          <Col span={6} className="add-item-button">
            <Button
              shape="circle"
              icon={<PlusCircleOutlined />}
              onClick={() => setIsListModalVisible(true)}
            />
            <Modal
              title="Añadir lista"
              visible={isListModalVisible}
              footer={null}
            >
              <AddList
                addList={addList}
                cancelModal={cancelListModal}
              />

            </Modal>
          </Col>
        </Row>
        <Form.Item name="name" label="Nombre" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Row>
          <Col span={18}>
            <Form.Item name="category" label="Categoría" rules={[{ required: true }]}>
              <Select
                placeholder="Selecciona la categoría a la que pertenece este producto"
              >
                {categories && categories.length > 0 && categories.map((category) =>
                  <Option value={category.id} key={category.id}>{category.name}</Option>
                )}
              </Select>

            </Form.Item>
          </Col>
          <Col span={6} className="add-item-button">
            <Button
              shape="circle"
              icon={<PlusCircleOutlined />}
              onClick={() => setIsCategoryModalVisible(true)}
            />
            <Modal
              title="Añadir Categoría"
              visible={isCategoryModalVisible}
              footer={null}
            >
              <AddCategory
                addCategory={addCategory}
                cancelModal={cancelCategoryModal}
              />

            </Modal>
          </Col>
        </Row>
        <Form.Item name="quantity" type="number" label="Cantidad" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {Object.entries(itemToEdit).length > 0 ? 'Actualizar' : 'Crear'}
          </Button>
          <Button htmlType="button" onClick={onReset}>
            Reset
          </Button>
        </Form.Item>
      </Form>
    </div >
  );
};
export default AddItem;