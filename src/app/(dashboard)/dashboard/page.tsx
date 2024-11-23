'use client'

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Shell } from '@/components/shell';
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from '@/components/page-header';

const OptimizedDashboard = () => {
  return (
    <Shell variant="sidebar">
      <PageHeader>
        <PageHeaderHeading size="sm">Dashboard</PageHeaderHeading>
        <PageHeaderDescription size="sm">
          Manage your billing and subscription plan
        </PageHeaderDescription>
      </PageHeader>
      <div className="grid grid-cols-3 gap-4">
        {/* Stats Cards */}
        <div className="col-span-3 md:col-span-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3  gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">生效订阅</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">24</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">即将到期</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">3</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">已节省</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">¥2,450</p>
              </CardContent>
            </Card>
          </div>

          {/* Subscription List */}
          <Card>
            <CardHeader>
              <CardTitle>订阅列表</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>订阅名称</TableHead>
                    <TableHead>版本</TableHead>
                    <TableHead>到期日期</TableHead>
                    <TableHead>状态</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>商店订阅</TableCell>
                    <TableCell>Free</TableCell>
                    <TableCell>2024-01-01</TableCell>
                    <TableCell>生效中</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Netflix</TableCell>
                    <TableCell>Pro</TableCell>
                    <TableCell>2024-01-01</TableCell>
                    <TableCell>生效中</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Order Details */}
        <Card className="col-span-3 md:col-span-1">
          <CardHeader>
            <CardTitle>订单详情</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">订单信息</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">订单编号:</div>
                <div>ORD2023120001</div>
                <div className="text-muted-foreground">创建时间:</div>
                <div>2023-12-01</div>
                <div className="text-muted-foreground">支付状态:</div>
                <div>已支付</div>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">订阅信息</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">产品名称:</div>
                <div>4选1组合套餐</div>
                <div className="text-muted-foreground">订阅周期:</div>
                <div>12个月</div>
                <div className="text-muted-foreground">订阅金额:</div>
                <div>¥999/年</div>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">附加信息</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">附加1:</div>
                <div>迪士尼*1</div>
                <div className="text-muted-foreground">附加2:</div>
                <div>YouTube*1</div>
                <div className="text-muted-foreground">附加3:</div>
                <div>OpenAI*1</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
};

export default OptimizedDashboard;