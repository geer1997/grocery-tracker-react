import React, { useState } from "react";
import { useFirestore } from "react-redux-firebase";
import { useSelector } from "react-redux";
import { Card, Col, Row } from "antd";
import './GroceryCategory.scss'
import GroceryItem from "./GroceryItem";

const GroceryCategory = ({ title, items }) => {
    // const [isGroceryItemDone, setGroceryItemDone] = useState(isDone);
    const firestore = useFirestore();
    const { uid } = useSelector(state => state.firebase.auth);

    // console.log("grocery item done", isGroceryItemDone);

    // const handleChange = (event) => {
    //     if (event.currentTarget.type === "checkbox") {
    //         setGroceryItemDone(!isGroceryItemDone);
    //         firestore.collection("items").doc(itemID).update({
    //             isDone: !isGroceryItemDone
    //         })
    //     }
    // };

    // Sorting items by name and by done
    items = items?.sort((a, b) => a.name < b.name ? 1 : -1);
    items = items?.sort((a, b) => a.isDone > b.isDone ? 1 : -1);

    return (
        <Col className="category-container">
            <div>
                <Card title={title} bordered={true} >
                    <Row>
                        {items && items.length > 0 ?
                            Object.values(items).map((item) => (
                                <GroceryItem
                                    key={item.id}
                                    title={item.name}
                                    quantity={item.quantity}
                                    isDone={item.isDone}
                                    itemID={item.itemID}
                                />
                            )) :
                            <div>
                                No hay artículos en esta lista
                            </div>
                        }
                    </Row>
                </Card>
            </div>

        </Col>

    );
};
export default GroceryCategory;