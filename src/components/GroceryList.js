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
            storeAs: 'groceryItems'
        }
    ]);

    let items = useSelector((state) => {
        console.log("info", state.firestore)
        return state.firestore.ordered.groceryItems
    });
    console.log("items", items);

    items = items?.map((item) => {
        return {
            ...item,
            categoryObject: categories?.find((category) => category.id === item.category)
        }
    })

    categories = categories?.map((category) => {
        return {
            ...category,
            items: items?.filter((item) => item.category === category.id)
        }
    })

    console.log("categories items", categories);


    // const categoryItems = [];
    // categoryItems.forEach(item => !categoryItems.includes(item.category) && categoryItems.push(item.category));

    const handleEditItem = (itemID) => {
        const item = items.find(it => it.id === itemID);
        item.groceryList = listId
        handleEdit(item);
    }

    return (
        <Row>
            <Col className="gutter-row" span={24}>
                <Card title={displayName} bordered={false}>
                    <Row gutter={[16, 24]}>
                        {categories &&
                            Object.values(categories).map((category) => (
                                <GroceryCategory
                                    key={category.id}
                                    title={category.name}
                                    items={category.items}
                                    handleEditItem={handleEditItem}
                                />
                            ))}
                    </Row>
                </Card>
            </Col>
        </Row>
    );
};
export default GroceryList;