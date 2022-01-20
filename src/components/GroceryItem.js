import React, { useState } from "react";
import './GroceryItem.scss';
import { useFirestore } from "react-redux-firebase";
import { useSelector } from "react-redux";
import { Button, Card, Col, Divider, Row, Tooltip } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

const GroceryItem = ({ isDone, title, quantity, createdBy, itemID }) => {
    const [isGroceryItemDone, setGroceryItemDone] = useState(isDone);
    const firestore = useFirestore();
    const { uid } = useSelector(state => state.firebase.auth);

    console.log("grocery item done", isGroceryItemDone);

    const handleChange = (event) => {
        if (event.currentTarget.type === "checkbox") {
            setGroceryItemDone(!isGroceryItemDone);
            firestore.collection("items").doc(itemID).update({
                isDone: !isGroceryItemDone
            })
        }
    };
    return (
        <div class="item-container" style={{
            textDecoration: isGroceryItemDone && "line-through",
            opacity: isGroceryItemDone ? 0.5 : 1,

        }}>
            <Row class="item-container">
                <Col span={9}>
                    <input
                        type="checkbox"
                        name=""
                        id=""
                        onChange={handleChange}
                        checked={isGroceryItemDone}
                    /> {title}
                </Col>
                <Col span={9}>
                    {
                        quantity ? quantity + ' unidades' : ''}
                </Col>
                <Col span={6}>
                    <Row gutter={16} class="option-button-row">
                        <Col span={12}>
                            <Tooltip title="search">
                                <Button type="primary" shape="circle" icon={<EditOutlined />} />
                            </Tooltip>
                        </Col>
                        <Col span={12}>
                            <Tooltip title="search">
                                <Button type="primary" shape="circle" icon={<DeleteOutlined />} />
                            </Tooltip>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Divider />
        </div>

    );
};
export default GroceryItem;