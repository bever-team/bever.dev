# Examples

The [bever-examples](https://github.com/bever-team/bever-examples) repository has complete models you can run. Each folder has a `README.md` that explains what it demonstrates.

| Example | Shows |
| --- | --- |
| [Task board](https://github.com/bever-team/bever-examples/tree/main/task-board) | The starter model: projects, tasks, sign-up, and assignees |
| [Order desk](https://github.com/bever-team/bever-examples/tree/main/order-desk) | The [tutorial](/guide/tutorial) app: customers, products, orders, and owner-only edits |
| [Personal notes](https://github.com/bever-team/bever-examples/tree/main/personal-notes) | Private records: everyone sees only their own notes |
| [Product catalog](https://github.com/bever-team/bever-examples/tree/main/product-catalog) | A public catalog that anyone can browse and signed-in staff can edit inline |
| [Help desk](https://github.com/bever-team/bever-examples/tree/main/help-desk) | Pickers that differ from reading, named pickers, modal pickers, and a role |

## Run an example

```sh
git clone https://github.com/bever-team/bever-examples
bever new "Help Desk"
cp bever-examples/help-desk/bev/*.bev "Help Desk/bev/"
rm "Help Desk/bev/app.bev"
cd "Help Desk"
bever dev
```

Copy the model before the first `bever dev`, so the first database is created from it.
