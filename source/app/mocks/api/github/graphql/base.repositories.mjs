/**Mocked data */
  export default function({faker, query, login = faker.internet.userName()}) {
    console.debug("metrics/compute/mocks > mocking graphql api result > base/repositories")
    return /after: "MOCKED_CURSOR"/m.test(query) ? ({
      user:{
        repositories:{
          edges:[],
          nodes:[],
        },
      },
    }) : ({
      user:{
        repositories:{
          edges:[
            {
              cursor:"MOCKED_CURSOR",
            },
          ],
          nodes:[
            {
              name:faker.random.words(),
              watchers:{totalCount:faker.random.number(1000)},
              stargazers:{totalCount:faker.random.number(10000)},
              owner:{login},
              languages:{
                edges:[
                  {size:faker.random.number(100000), node:{color:faker.internet.color(), name:faker.lorem.word()}},
                  {size:faker.random.number(100000), node:{color:faker.internet.color(), name:faker.lorem.word()}},
                  {size:faker.random.number(100000), node:{color:faker.internet.color(), name:faker.lorem.word()}},
                  {size:faker.random.number(100000), node:{color:faker.internet.color(), name:faker.lorem.word()}},
                  {size:faker.random.number(100000), node:{color:faker.internet.color(), name:faker.lorem.word()}},
                  {size:faker.random.number(100000), node:{color:faker.internet.color(), name:faker.lorem.word()}},
                  {size:faker.random.number(100000), node:{color:faker.internet.color(), name:faker.lorem.word()}},
                ],
              },
              issues_open:{totalCount:faker.random.number(100)},
              issues_closed:{totalCount:faker.random.number(100)},
              pr_open:{totalCount:faker.random.number(100)},
              pr_merged:{totalCount:faker.random.number(100)},
              releases:{totalCount:faker.random.number(100)},
              forkCount:faker.random.number(100),
              licenseInfo:{spdxId:"MIT"},
            },
          ],
        },
      },
    })
  }
