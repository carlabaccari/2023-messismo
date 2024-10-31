import React from "react";
import styled from 'styled-components';
import Navbar from "../components/Navbar";
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import ProductsList from "../components/ProductsList";
import CombosList from "../components/CombosList";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
    font-size:1.5rem;
`;

const MainContent = styled.div`
    display: ${props => (props.visible ? 'flex' : 'none')};
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    flex-grow: 1;
    font-size:1.5rem;
  
`;
function Combos(){

    const { user: currentUser } = useSelector((state) => state.auth);
    const clicked = useSelector((state) => state.navigation.clicked);

    const contentVisible = !clicked;

    if (!currentUser) {
        return <Navigate to="/" />;
    }
    

    return(
    <Container className='products'>
        <Navbar />
        <MainContent visible={contentVisible}>
            <CombosList/>
        </MainContent>
    </Container>
    )
}

export default Combos;