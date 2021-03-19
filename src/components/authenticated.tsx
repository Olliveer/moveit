import { GetStaticProps, InferGetServerSidePropsType } from "next";
import React from 'react';
import { connectToDatabase } from "../util/mongodb";
import { Sidebar } from './Sidebar';

