# Guía de Backend: Track 4 - Pedidos

## Modelos (SQLModel)
- **Order**:
  ```python
  class OrderBase(SQLModel):
      total: float = Field(default=0.0)
      status: str = Field(default="pending")
      user_id: int = Field(foreign_key="user.id")
  
  class Order(OrderBase, table=True):
      id: Optional[int] = Field(default=None, primary_key=True)
      user: "User" = Relationship(back_populates="orders")
      items: list["OrderItem"] = Relationship(back_populates="order")
  ```
- **OrderItem**:
  ```python
  class OrderItemBase(SQLModel):
      order_id: int = Field(foreign_key="order.id")
      product_id: int = Field(foreign_key="product.id")
      quantity: int
      price: float
  
  class OrderItem(OrderItemBase, table=True):
      id: Optional[int] = Field(default=None, primary_key=True)
      order: Order = Relationship(back_populates="items")
  ```

## Endpoints (FastAPI)
- `POST /orders/`: Crear pedido (Validar stock de productos).
- `GET /orders/`: Listar pedidos del usuario logueado.
- `GET /orders/{id}`: Detalle de orden.
- `PATCH /orders/{id}/status`: Cambiar estado (`"pending"`, `"paid"`, `"shipped"`, `"delivered"`, `"cancelled"`).
- `DELETE /orders/{id}`: Cancelar pedido (restaurar stock si aplica).
