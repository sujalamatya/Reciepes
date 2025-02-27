"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
//import Sidebar from "@/components/common/Sidebar";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import Navbar from "@/components/common/Navbar";

const fetchDashboardData = async () => {
  try {
    // Fetch all recipes
    const response = await fetch("https://dummyjson.com/recipes");
    const data = await response.json();

    // Extract necessary stats
    const totalRecipes = data.total; // total recipes count
    const categories = data.recipes.reduce((acc: any, recipe: any) => {
      acc[recipe.mealType] = (acc[recipe.mealType] || 0) + 1;
      return acc;
    }, {});

    // Convert categories object to array for charts
    const categoryDistribution = Object.keys(categories).map((key) => ({
      name: key,
      value: categories[key],
    }));

    return {
      users: 1200, // Mocked data, replace with real user API
      recipes: totalRecipes,
      foodItems: 800, // Mocked data, replace with real API
      categoryDistribution,
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return {
      users: 0,
      recipes: 0,
      foodItems: 0,
      categoryDistribution: [],
    };
  }
};


export default function AdminDashboard() {
  const [data, setData] = useState({
    users: 0,
    recipes: 0,
    foodItems: 0,
    categoryDistribution: [],
  });

  useEffect(() => {
    (async () => {
      const fetchedData = await fetchDashboardData();
      setData(fetchedData);
    })();
  }, []);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

  return (
    <div className="flex">
      {/* <Sidebar /> */}
      <div className="flex-1 p-6">
        <Navbar />
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{data.users}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Recipes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{data.recipes}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Food Items</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{data.foodItems}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Recipes Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.categoryDistribution}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Category Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data.categoryDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                  >
                    {data.categoryDistribution.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        <h2 className="text-2xl font-bold mt-6">Recent Users</h2>
        <Table className="mt-4">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Replace with API Data */}
            <TableRow>
              <TableCell>1</TableCell>
              <TableCell>Luzza Dangol</TableCell>
              <TableCell>luzzadangol12@gmail.com</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <h2 className="text-2xl font-bold mt-6">Recent Recipes</h2>
        <Table className="mt-4">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Recipe Name</TableHead>
              <TableHead>Category</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Replace with API Data */}
            <TableRow>
              <TableCell>101</TableCell>
              <TableCell>Momo</TableCell>
              <TableCell>Dumpling</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
