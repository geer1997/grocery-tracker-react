import { Divider, Card, Col, Row } from "antd";
import React,  { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { compose } from "redux";
import { connect } from "react-redux";
import { useFirestoreConnect, firestoreConnect } from "react-redux-firebase";
import { auth } from "..";
import AddItem from "../components/AddItem";
import GroceryItem from "../components/GroceryItem";
import GroceryCategory from "../components/GroceryCategory";
import GroceryList from "../components/GroceryList";

const Items = () => {
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

  useFirestoreConnect((props) => [
    {
      collection: `grocery-lists`,
      storeAs: 'groceryLists'
    },
    {
      collection: 'categories'
    }
  ]);

  let categories = useSelector((state) => state.firestore.ordered.categories);

  let groceryLists = useSelector((state) => {
    console.log("info", state.firestore)
    return state.firestore.ordered.groceryLists;
  });
  console.log("groceryLists", groceryLists, categories);

  groceryLists = Object.values(groceryLists)?.sort((a, b) => a.date?.toDate() < b.date?.toDate() ? 1 : -1)

  const [itemToEdit, setItemToEdit] = useState({});
  const [errors, setErrors] = useState(0);
  
  
  const handleEdit = (item) => {
    console.log("handling item", item)
    if (!item.isDone) {
      setItemToEdit(item);
    }
    // useEffect(() => {
    //   console.log("is reloading")
    // }, [item]);
  }

  return (
    <div>
      <h2><b>Productos a Comprar</b></h2>
      <Divider />

      <div className="site-card-wrapper">
        <Row gutter={16}>
          <Col span={6}>
            <AddItem
              key={itemToEdit}
              categories={categories}
              groceryLists={groceryLists}
              itemToEdit={itemToEdit}
            />
          </Col>
          <Col span={16} style={{overflow: 'auto', height: '100%'}}>
            {groceryLists &&
              Object.values(groceryLists).map((gList) => (
                <GroceryList
                  key={gList.id}
                  categories={categories}
                  listId={gList.id}
                  displayName={gList.date.toDate().toLocaleString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                  handleEdit={handleEdit}
                />
              ))}
          </Col>
        </Row>
      </div>
    </div>
  );
};
export default Items;