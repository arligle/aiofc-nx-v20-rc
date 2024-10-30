libs/persistence-api/src/lib/repository/abstract.repository.ts

AbstractRepository 是一个抽象类，这意味着它不能被直接实例化。相反，它提供了一个基础结构，具体的存储库类可以继承并实现其抽象方法。

抽象类通常用于定义通用的行为和接口，以便在子类中重用。


## 泛型参数：

AbstractRepository 类使用了多个泛型参数，以提高其灵活性和可重用性。以下是每个泛型参数的详细说明：

ENTITY extends BaseEntity： 这个泛型参数表示存储库操作的实体类型。ENTITY 必须是 BaseEntity 的子类。BaseEntity 通常是一个包含基本属性（如 id 和 createdAt）的基类。

ID extends keyof ENTITY： 这个泛型参数表示实体的主键类型。ID 必须是 ENTITY 类型的一个键。通常，ID 是实体的唯一标识符，如 id 属性。

FIND_OPTIONS： 这个泛型参数表示查找操作的选项类型。它可以是任何类型，具体取决于存储库的实现。查找选项通常用于指定查询条件、排序和分页等。

FIELDS_REQUIRED_FOR_UPDATE extends keyof ENTITY = ID： 这个泛型参数表示更新操作所需的字段类型。默认情况下，它是 ID 类型的字段。更新操作通常需要指定哪些字段是必需的，以确保数据的一致性和完整性。

AUTO_GENERATED_FIELDS extends keyof ENTITY = keyof BaseEntity | ID： 这个泛型参数表示自动生成的字段类型。默认情况下，它是 BaseEntity 类型的所有键和 ID 类型的字段。自动生成的字段通常包括 id、createdAt 和 updatedAt 等。