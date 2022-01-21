import { Divider, Card, Col, Row } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { compose } from "redux";
import { connect } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";
import { auth } from "..";
import AddItem from "../components/AddItem";
import GroceryItem from "../components/GroceryItem";
import GroceryCategory from "../components/GroceryCategory";

const GroceryList = ({ listId, displayName, categories, handleEdit }) => {
    // const mapStateToProps = (state) => {
    //   const {
    //     items,
    //     categories,
    //   } = state.firestore.ordered;
    //   const { posts: postsDict } = state.firestore.data;
    //   return {
    //     items: items || [],
    //     categories: categories || [],
    //   };
    // };

    // compose(
    //   useFirestoreConnect((props) => {
    //     return [
    //       { collection: 'items' },
    //       { collection: 'categories' },
    //     ];
    //   }),
    //   connect(mapStateToProps)
    // )

    useFirestoreConnect([
        {
            collection: `grocery-lists`,
            doc: listId,
            subcollections: [{ collection: 'items' }],
            storeAs: `groceryItems${listId}`
        }
    ]);

    let items = useSelector((state) => {
        console.log("info", listId, state.firestore)
        return state.firestore.ordered[`groceryItems${listId}`]
    });
    console.log("items", listId, items);

    items = items?.map((item) => {
        return {
            ...item,
            groceryList: listId,
            categoryObject: categories?.find((category) => category.id === item.category)
        }
    })

    categories = categories?.map((category) => {
        return {
            ...category,
            items: items?.filter((item) => item.category === category.id)
        }
    })

    return (
        <Row>
            <Col className="gutter-row" span={24}>
                <Card title={displayName} bordered={false}>
                    <Row gutter={[16, 24]}>
                        {categories &&
                            Object.values(categories).map((category) => (
                                category.items && category.items.length > 0 &&
                                <GroceryCategory
                                    key={category.id}
                                    title={category.name}
                                    items={category.items}
                                    handleEditItem={handleEdit}
                                />
                            ))}
                    </Row>
                </Card>
            </Col>
        </Row>
    );
};
export default GroceryList;